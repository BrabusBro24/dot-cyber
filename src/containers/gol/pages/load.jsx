import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Dots, TextTable } from '../../../components';
import {
  getAmountATOM,
  getGraphQLQuery,
  getIndexStats,
} from '../../../utils/search/utils';
import { exponentialToDecimal, formatNumber } from '../../../utils/utils';
import { cybWon } from '../../../utils/fundingMath';
import { COSMOS, TAKEOFF, DISTRIBUTION, CYBER } from '../../../utils/config';

const GET_CHARACTERS = `
query MyQuery {
  karma_view(order_by: {karma: desc}, limit: 50, offset: 0) {
    karma
    subject
  }
  karma_view_aggregate {
    aggregate {
      count
    }
  }
}
`;

const Query = page =>
  `query MyQuery {
    karma_view(order_by: {karma: desc}, limit: 50, offset: ${page}) {
      karma
      subject
    }
  }`;

const QueryAddress = address =>
  ` query MyQuery {
  karma_view(where: {subject: {_eq: "${address}"}}) {
    karma
    subject
  }
}`;

class GolLoad extends React.Component {
  ws = new WebSocket(COSMOS.GAIA_WEBSOCKET_URL);

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      page: 0,
      allPage: 0,
      sumKarma: 0,
      currentPrize: 0,
      loadingAtom: true,
      addAddress: false,
    };
  }

  async componentDidMount() {
    await this.getFirstItem();
    this.getDataWS();
  }

  getDataWS = async () => {
    this.ws.onopen = () => {
      console.log('connected');
    };

    this.ws.onmessage = async evt => {
      const message = JSON.parse(evt.data);
      console.log('txs', message);
      this.getAtom(message);
    };

    this.ws.onclose = () => {
      console.log('disconnected');
    };
  };

  getAtom = async dataTxs => {
    let amount = 0;
    let won = 0;

    if (dataTxs) {
      amount = getAmountATOM(dataTxs);
    }

    won = cybWon(amount);

    const currentPrize = Math.floor(
      (won / DISTRIBUTION.takeoff) * DISTRIBUTION.load
    );

    this.setState({
      loadingAtom: false,
      currentPrize,
    });
  };

  getFirstItem = async () => {
    const { page, items } = this.state;
    let address = [];
    const itemsData = [];
    let allPage = 0;
    let sumKarma = 0;

    const localStorageStory = await localStorage.getItem('ledger');
    if (localStorageStory !== null) {
      address = JSON.parse(localStorageStory);
      const dataLocal = await getGraphQLQuery(QueryAddress(address.bech32));
      if (Object.keys(dataLocal.karma_view).length > 0) {
        dataLocal.karma_view[0].local = true;
        itemsData.push(...dataLocal.karma_view);
      }
    }

    const data = await getGraphQLQuery(GET_CHARACTERS);
    const responseIndexStats = await getIndexStats();

    if (data.karma_view_aggregate) {
      allPage = data.karma_view_aggregate.aggregate.count;
    }

    if (Object.keys(data.karma_view).length > 0) {
      if (responseIndexStats !== null) {
        sumKarma = responseIndexStats.totalKarma;
      }
      itemsData.push(...data.karma_view);
    }
    this.setState({
      items: items.concat(itemsData),
      sumKarma,
      page: page + 1,
      allPage: Math.ceil(parseFloat(allPage) / 1),
    });
  };

  fetchMoreData = async () => {
    const { page, items } = this.state;
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    const data = await getGraphQLQuery(Query(page));

    setTimeout(() => {
      this.setState({
        items: items.concat(data.karma_view),
        page: page + 1,
      });
    }, 500);
  };

  render() {
    const {
      page,
      allPage,
      items,
      currentPrize,
      sumKarma,
      loadingAtom,
    } = this.state;
    console.log(items);

    if (loadingAtom) {
      return <Dots />;
    }
    return (
      <main
        // style={{ justifyContent: 'space-between' }}
        className="block-body"
      >
        <Pane
          boxShadow="0px 0px 5px #36d6ae"
          paddingX={20}
          paddingY={20}
          marginY={20}
        >
          <Text fontSize="16px" color="#fff">
            Submit as much cyberlinks as possible! We need to test the network
            under heavy load. Testing of decentralized networks under load near
            real conditions is hard and expensive. So you can submit as much
            cyberlinks as possible. Although quality of cyberlinks doesn't count
            in this discipline we would recommend you submit something
            meaningful, which increase value of our knowledge graph. We prepare
            some default scripts for this. Max reward for this discipline is 6
            TCYB. Details of reward calculation you can find in Game of Links
            rules
          </Text>
        </Pane>
        <div
          id="scrollableDiv"
          style={{ height: 'calc(100vh - 360px)', overflow: 'auto' }}
        >
          <Table>
            <Table.Head
              style={{
                backgroundColor: '#000',
                borderBottom: '1px solid #ffffff80',
                marginTop: '10px',
                padding: 7,
                paddingBottom: '10px',
              }}
            >
              <Table.TextHeaderCell flex={2} textAlign="center">
                <TextTable>Address</TextTable>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell flex={0.5} textAlign="center">
                <TextTable>Constrol, ‱</TextTable>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell flex={0.5} textAlign="center">
                <TextTable>Karma</TextTable>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell flex={0.5} textAlign="center">
                <TextTable>CYB won</TextTable>
              </Table.TextHeaderCell>
            </Table.Head>
            <Table.Body
              style={{
                backgroundColor: '#000',
                overflowY: 'hidden',
                padding: 7,
              }}
            >
              <InfiniteScroll
                dataLength={items.length}
                next={this.fetchMoreData}
                hasMore={page < allPage}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
              >
                {items.map((item, index) => {
                  let load = 0;
                  let cybWonAbsolute = 0;
                  let control = 0;
                  if (sumKarma > 0) {
                    load = parseFloat(item.karma) / parseFloat(sumKarma);
                    cybWonAbsolute = load * currentPrize;
                    control = (cybWonAbsolute / DISTRIBUTION.load) * 10000;
                  }

                  return (
                    <Table.Row
                      paddingX={0}
                      paddingY={5}
                      borderBottom={item.local ? '1px solid #3ab793bf' : 'none'}
                      display="flex"
                      minHeight="48px"
                      height="fit-content"
                      key={(item.subject, index)}
                    >
                      <Table.TextCell flex={2}>
                        <TextTable>{item.subject}</TextTable>
                      </Table.TextCell>
                      <Table.TextCell flex={0.5} textAlign="end">
                        <TextTable>
                          {exponentialToDecimal(control.toPrecision(2))}
                        </TextTable>
                      </Table.TextCell>
                      <Table.TextCell flex={0.5} textAlign="end">
                        <TextTable>{formatNumber(item.karma)}</TextTable>
                      </Table.TextCell>
                      <Table.TextCell flex={0.5} textAlign="end">
                        <TextTable>
                          {formatNumber(Math.floor(cybWonAbsolute))}
                        </TextTable>
                      </Table.TextCell>
                    </Table.Row>
                  );
                })}
              </InfiniteScroll>
            </Table.Body>
          </Table>
        </div>
      </main>
    );
  }
}

export default GolLoad;
