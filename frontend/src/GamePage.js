import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import LoadingOverlay from 'react-loading-overlay';

export default function GamePage() {

  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

    useEffect(() => {

      if(!window.balance) {
        navigate("/")
      }
        window.addEventListener('message', async event => {
            if (event.origin !== 'http://localhost:8080') {
              return;
            }
            const receivedJson = JSON.parse(event.data);
            if(receivedJson.event === 'whatIsAddress') {
              event.source.postMessage(window.account, event.origin);

            }else if(receivedJson.event === "myScore"){
              setIsActive(true);
              await window.contract.methods.recordScore(window.account, receivedJson.score).send({from: window.account});
              const counts = await window.contract.methods.playerCount().call();
              console.log(receivedJson.score, counts);
              navigate("/");
            }
          }, false);
    })
    
    return (
        <div>
          <LoadingOverlay
            active={isActive}
            spinner
            text='Recording your sore.'
            styles={{
              wrapper: {
                width: '100%',
                height: '100%',
                overflow: isActive ? 'hidden' : 'scroll'
              },
            }}
            >
            <iframe src="http://localhost:8080" title='game' style={{overflow: "hidden", height: "100%", width: "100%", position: "absolute"}}></iframe>
          </LoadingOverlay>
        </div>
    )
}
