import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import { useEffect } from 'react';

// Styling for the text in the ipnut log paragraph
const WhiteTextTypography = withStyles({
    root: {
      color: "#FFFFFF"
    }
  })(Typography);

//Takes the each entry in the Log list on Home.js
//outputs each entry into the Log paragraph line by line.
export default function Inputlog(props){
    const Log = props.Log;
    const setLog = props.setLog;
    
    useEffect(() =>{
      let Logging = []
      for(let i = 0; i < Log.length; i++){
        Logging.push(<p>{Log[i]}</p>);
        setLog(Logging);
      };
    },[]);
    
    return(
        //Html for the Log page
        <div>
            <h1 className="log_head">Input Log</h1>
            <WhiteTextTypography  variant="h4" id="log" className="input_log" paragraph>
              {Log}
            </WhiteTextTypography>
        </div>
    )
};