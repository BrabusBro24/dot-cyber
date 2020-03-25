import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Text, Pane, TableEv as Table } from '@cybercongress/gravity';
import {
  getAmountATOM,
  getValidatorsInfo,
  getValidators,
} from '../../../utils/search/utils';
import {
  CardStatisics,
  Loading,
  LinkWindow,
  TextTable,
} from '../../../components';
import { cybWon, getDisciplinesAllocation } from '../../../utils/fundingMath';
import TableDiscipline from '../table';
import { getDelegator, exponentialToDecimal, sort } from '../../../utils/utils';

import { COSMOS, TAKEOFF, DISTRIBUTION } from '../../../utils/config';

class GolDelegation extends React.Component {
  ws = new WebSocket(COSMOS.GAIA_WEBSOCKET_URL);

  constructor(props) {
    super(props);
    this.state = {
      addressLedger: null,
      validatorAddress: null,
      loading: true,
      won: 0,
      currentPrize: 0,
      takeoffDonations: 0,
      herosCount: 0,
      dataTable: [],
      total: 0,
      addAddress: false,
    };
  }

  async componentDidMount() {
    await this.checkAddressLocalStorage();
    await this.getDataWS();
    // this.getMyGOLs();
    this.getValidatorsCount();
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

  checkAddressLocalStorage = async () => {
    let address = [];

    const localStorageStory = await localStorage.getItem('ledger');
    if (localStorageStory !== null) {
      address = JSON.parse(localStorageStory);
      console.log('address', address);
      const validatorAddress = getDelegator(address.bech32, 'cybervaloper');

      this.setState({
        addressLedger: address,
        validatorAddress,
        addAddress: false,
      });
    } else {
      this.setState({
        addAddress: true,
        loading: false,
      });
    }
  };

  getValidatorsCount = async () => {
    const { validatorAddress } = this.state;
    const dataTable = [];
    let total = 0;
    const data = await getValidators();
    let herosCount = 0;
    if (data !== null) {
      data.forEach(item => {
        total += parseFloat(item.tokens);
        let addressStorage = false;
        if (validatorAddress === item.operator_address) {
          addressStorage = true;
        }
        dataTable.push({
          operatorAddress: item.operator_address,
          moniker: item.description.moniker,
          tokens: item.tokens,
          addressStorage,
        });
      });
      herosCount = data.length;
    }

    sort(dataTable, 'tokens');
    sort(dataTable, 'addressStorage');

    this.setState({
      dataTable,
      herosCount,
      total,
    });
  };

  getAtom = async dataTxs => {
    let amount = 0;
    let won = 0;

    if (dataTxs) {
      amount = getAmountATOM(dataTxs);
    }

    won = cybWon(amount);

    const currentPrize = Math.floor(
      (won / DISTRIBUTION.takeoff) * DISTRIBUTION.delegation
    );

    this.setState({
      won,
      loading: false,
      currentPrize,
    });
  };

  render() {
    const {
      loading,
      won,
      dataTable,
      total,
      addressLedger,
      validatorAddress,
      currentPrize,
      herosCount,
      consensusAddress,
    } = this.state;
    const { load } = this.props;

    console.log('dataTable', dataTable);
    console.log('validatorAddress', validatorAddress);

    if (loading) {
      return (
        <div
          style={{
            width: '100%',
            height: '50vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Loading />
        </div>
      );
    }

    const content = dataTable.map(item => (
      <Table.Row
        paddingX={0}
        paddingY={5}
        borderBottom={item.addressStorage ? '1.5px solid #3ab79391' : 'none'}
        display="flex"
        minHeight="48px"
        height="fit-content"
        key={item.operatorAddress}
      >
        <Table.TextCell>
          <TextTable>{item.moniker}</TextTable>
        </Table.TextCell>
        <Table.TextCell textAlign="end">
          <TextTable>{item.tokens}</TextTable>
        </Table.TextCell>
        <Table.TextCell textAlign="end">
          <TextTable>
            {Math.floor((item.tokens / total) * currentPrize)}
          </TextTable>
        </Table.TextCell>
      </Table.Row>
    ));

    return (
      <div>
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
              Get more voting power for your validator - get more rewards! This
              disciplines is social discipline for heros with max prize of 5
              TCYB. Huge chunk of CYB stake allocated to all Ethereans and
              Cosmonauts. The more you spread, the more users will claim its
              allocation, the more voting power as validators you will have in
              Genesis. Details of reward calculation you can find in Game of
              Links rules
            </Text>
          </Pane>
          <Pane
            display="flex"
            marginTop={20}
            marginBottom={50}
            justifyContent="center"
            flexDirection="column"
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
                <Table.TextHeaderCell textAlign="center">
                  <TextTable>Address</TextTable>
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex={0.5} textAlign="center">
                  <TextTable>EULs delegated</TextTable>
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
                {content}
              </Table.Body>
            </Table>
          </Pane>
        </main>
        {/* <ActionBarContainer
          addAddress={addAddress}
          cleatState={this.cleatState}
          updateFunc={this.checkAddressLocalStorage}
        /> */}
      </div>
    );
  }
}

export default GolDelegation;
