import * as React from 'react';
import socketIOClient from "socket.io-client";

export interface IAppProps {
}

export interface IHash {
  [ccy: string]: number;
}


export default class App extends React.Component<IAppProps> {


  ccypairs = [
    'GBPJPY',
    'AUDCAD',
    'EURCHF',
    'EURUSD',
    'USDJPY',
    'GBPUSD',
    'GBPJPY',
    'EURPY',
    'AUDUSD',
    'NZDUSD',
    'EURCAD',
    'EURAUD'
  ];


  state = {
    data: {} as IHash
  }

  componentDidMount() {
    const socket = socketIOClient("http://127.0.0.1:5050");
    socket.on("prices", (sdata: any) => {
      let data = { ...this.state.data };

      let symbol = sdata.symbol as string;
      let sbid: string = sdata.bid.toString();
      let bidLength = sbid.substr(sbid.indexOf(".") + 1).length;

      let sask: string = sdata.ask.toString();

      let askLength = sask.substr(sask.indexOf(".") + 1).length;
      if (symbol.indexOf("JPY") == -1 && (bidLength >= 5 && askLength >= 5)) {
        data[sdata.symbol] = sdata;
        this.setState({ data }, () => { })
      }


      if (symbol.indexOf("JPY") > 0 && (bidLength == 3 && askLength == 3)) {
        data[sdata.symbol] = sdata;
        this.setState({ data }, () => { })
      }




    })
  }

  public render() {



    return (
      <div style={{display:"flex",margin:10,padding:10,height:"80%",width:"90%",flexWrap:"wrap",border:"1px solid rgb(170,170,170)"}}>

        {

          this.ccypairs.map((ccypair: any, i: number) => {


            let ccy = this.state.data[ccypair as string] as any;

            if (!ccy)
              return;

            let sbid: string = ccy.bid.toString();

            let bidInteger = sbid.substr(0, sbid.indexOf("."));
            if (bidInteger == null || bidInteger == "")
              bidInteger = "0"


            let bidDecimal = sbid.substr(sbid.indexOf(".") + 1);

            let bidPrePip = bidDecimal.substr(0, bidDecimal.length - 3);

            let bidPip = bidDecimal.substr(bidDecimal.length - 3, 2);
            let bidPippete = bidDecimal.substr(bidDecimal.length - 1);


            let sask: string = ccy.ask.toString();

            let askInteger = sask.substr(0, sask.indexOf("."));
            if (askInteger == null || askInteger == "")
              askInteger = "0"


            let askDecimal = sask.substr(sask.indexOf(".") + 1);

            let askPrePip = askDecimal.substr(0, askDecimal.length - 3);

            let askPip = askDecimal.substr(askDecimal.length - 3, 2);
            let askPippete = askDecimal.substr(askDecimal.length - 1);

            if (ccy.symbol.indexOf("JPY") < 0 && (bidDecimal.length < 5 || askDecimal.length < 5))
              return;




            return (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", margin: 10 ,border:"1px solid rgba(0,0,0,0.7)", width:300,padding:10}}>
                <span><h5>{ccy.symbol}</h5></span>
                <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: 10, width: "100%" }}>
                  <div style={{display:"flex",alignItems:"baseline"}}>
                    <span style={{ width: 20 }}></span><span>sell</span><span style={{ width: 20 }}></span><span>{bidInteger}</span><span>.</span><span>{bidPrePip}</span><span><h1>{bidPip}</h1></span><span>{bidPippete}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"baseline"}}>

                    <span style={{ width: 20 }}></span><span>buy</span><span style={{ width: 20 }}></span><span>{askInteger}</span><span>.</span><span>{askPrePip}</span><span><h1>{askPip}</h1></span><span>{askPippete}</span>
                  </div>
                </div>
              </div>
            )

          })

        }



      </div>
    );
  }
}
