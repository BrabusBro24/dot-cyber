import React from 'react';
import { Tablist, Tab, Pane, Text } from '@cybercongress/gravity';
import { Route, Link } from 'react-router-dom';
import GetLink from './link';
import {
  getBalance,
  getTotalEUL,
  getDistribution,
  getRewards,
  getIpfsHash,
} from '../../utils/search/utils';
// import Balance fro./mainnce';
import Heroes from './heroes';
import Unbondings from './unbondings';
import { getDelegator, formatNumber, asyncForEach } from '../../utils/utils';
import { Loading, Copy, ContainerCard, Card } from '../../components';
import ActionBarContainer from './actionBar';
import GetTxs from './txs';
import Main from './main';
import GetMentions from './mentions';

const TabBtn = ({ text, isSelected, onSelect, to }) => (
  <Link to={to}>
    <Tab
      key={text}
      isSelected={isSelected}
      onSelect={onSelect}
      paddingX={20}
      paddingY={20}
      marginX={3}
      borderRadius={4}
      color="#36d6ae"
      boxShadow="0px 0px 5px #36d6ae"
      fontSize="16px"
      whiteSpace="nowrap"
      minWidth="150px"
    >
      {text}
    </Tab>
  </Link>
);

class AccountDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      keywordHash: '',
      loader: true,
      addressLedger: null,
      balance: {
        available: 0,
        delegation: 0,
        unbonding: 0,
        rewards: 0,
        total: 0,
      },
      staking: {
        delegations: [],
        unbonding: [],
      },
      selected: 'main',
    };
  }

  componentDidMount() {
    const localStorageStory = localStorage.getItem('ledger');
    if (localStorageStory !== null) {
      const address = JSON.parse(localStorageStory);
      console.log('address', address);
      this.setState({ addressLedger: address.bech32 });
    }
    this.getBalanseAccount();
    this.chekPathname();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      this.getBalanseAccount();
      this.chekPathname();
    }
  }

  chekPathname = () => {
    const { location } = this.props;
    const { pathname } = location;

    if (pathname.match(/txs/gm) && pathname.match(/txs/gm).length > 0) {
      this.select('txs');
    } else if (
      pathname.match(/cyberlink/gm) &&
      pathname.match(/cyberlink/gm).length > 0
    ) {
      this.select('cyberlink');
    } else if (
      pathname.match(/heroes/gm) &&
      pathname.match(/heroes/gm).length > 0
    ) {
      this.select('heroes');
    } else if (
      pathname.match(/mentions/gm) &&
      pathname.match(/mentions/gm).length > 0
    ) {
      this.select('mentions');
    } else {
      this.select('main');
    }
  };

  getBalanseAccount = async () => {
    const { match } = this.props;
    const { address } = match.params;
    let total;
    const staking = {
      delegations: [],
      unbonding: [],
    };

    const keywordHash = await getIpfsHash(address);

    await this.setState({ account: address, keywordHash });

    const result = await getBalance(address);
    console.log('result', result);

    const validatorAddress = getDelegator(address, 'cybervaloper');

    const resultGetDistribution = await getDistribution(validatorAddress);

    if (resultGetDistribution) {
      result.val_commission = resultGetDistribution.val_commission;
    }
    if (result) {
      total = await getTotalEUL(result);
      if (result.delegations && result.delegations.length > 0) {
        staking.delegations = result.delegations;
        staking.delegations = await this.countReward(
          staking.delegations,
          address
        );
      }

      if (result.unbonding && result.unbonding.length > 0) {
        staking.delegations.map((item, index) => {
          return result.unbonding.map(itemUnb => {
            if (item.validator_address === itemUnb.validator_address) {
              staking.delegations[index].entries = itemUnb.entries;
            }
            return staking.delegations[index];
          });
        });
        staking.unbonding = result.unbonding;
      }
    }
    this.setState({ balance: total, staking, loader: false });
  };

  countReward = async (data, address) => {
    const delegations = data;
    await asyncForEach(
      Array.from(Array(delegations.length).keys()),
      async item => {
        let reward = 0;
        const resultRewards = await getRewards(
          address,
          delegations[item].validator_address
        );
        if (resultRewards) {
          reward = parseFloat(resultRewards[0].amount);
          delegations[item].reward = Math.floor(reward);
        } else {
          delegations[item].reward = reward;
        }
      }
    );
    return delegations;
  };

  select = selected => {
    this.setState({ selected });
  };

  render() {
    const {
      account,
      balance,
      staking,
      selected,
      loader,
      keywordHash,
      addressLedger,
    } = this.state;

    let content;

    if (loader) {
      return (
        <div
          style={{
            height: '50vh',
          }}
          className="container-loading"
        >
          <Loading />
        </div>
      );
    }

    if (selected === 'heroes') {
      content = (
        <Route
          path="/network/euler-5/contract/:address/heroes"
          render={() => <Heroes data={staking} />}
        />
      );
    }

    if (selected === 'main') {
      content = <Main balance={balance} />;
    }

    if (selected === 'cyberlink') {
      content = (
        <Route
          path="/network/euler-5/contract/:address/cyberlink"
          render={() => <GetLink accountUser={account} />}
        />
      );
    }

    if (selected === 'txs') {
      content = (
        <Route
          path="/network/euler-5/contract/:address/txs"
          render={() => <GetTxs accountUser={account} />}
        />
      );
    }

    if (selected === 'mentions') {
      content = (
        <Route
          path="/network/euler-5/contract/:address/mentions"
          render={() => <GetMentions accountUser={keywordHash} />}
        />
      );
    }

    return (
      <div>
        <main className="block-body">
          <Pane
            marginBottom={20}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text color="#fff" fontSize="18px">
              {account} <Copy text={account} />
            </Text>
          </Pane>
          <ContainerCard col={1}>
            <Card title="total, EUL" value={formatNumber(balance.total)} />
          </ContainerCard>
          <Tablist display="flex" justifyContent="center">
            <TabBtn
              text="Cyberlinks"
              isSelected={selected === 'cyberlink'}
              to={`/network/euler-5/contract/${account}/cyberlink`}
            />
            <TabBtn
              text="Heroes"
              isSelected={selected === 'heroes'}
              to={`/network/euler-5/contract/${account}/heroes`}
            />
            <TabBtn
              text="Main"
              isSelected={selected === 'main'}
              to={`/network/euler-5/contract/${account}`}
            />
            <TabBtn
              text="Txs"
              isSelected={selected === 'txs'}
              to={`/network/euler-5/contract/${account}/txs`}
            />
            <TabBtn
              text="Mentions"
              isSelected={selected === 'mentions'}
              to={`/network/euler-5/contract/${account}/mentions`}
            />
          </Tablist>
          <Pane
            display="flex"
            marginTop={20}
            marginBottom={50}
            justifyContent="center"
            flexDirection="column"
          >
            {content}
          </Pane>
        </main>
        <ActionBarContainer
          updateAddress={this.getBalanseAccount}
          addressSend={account}
          type={selected}
          addressLedger={addressLedger}
        />
      </div>
    );
  }
}

export default AccountDetails;
