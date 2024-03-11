import {
  processActionConnectFulfilled,
  processSendMessageActivity,
  processIncomingActivity,
} from './helpers/startConvoAndTrackUtterancesHelpers';

let prevTexts = [];

const StartConvoAndTrackUtterances = {
  makeBotStartConvoAndTrackUtterances: (
    csrfToken,
    apiSession,
    apiURL,
    baseURL,
    userFirstName,
    userUuid,
    isMobile,
  ) => ({ dispatch }) => next => action => {
    const options = {
      action,
      dispatch,
      csrfToken,
      apiSession,
      apiURL,
      baseURL,
      userFirstName,
      userUuid,
      isMobile,
    };

    // This method is here to reset the prevTexts array so a similar command can be added later.
      const sendMessageActivity = (options) => {
          processSendMessageActivity(options)
          //prevTexts = [];
          // console.log(prevTexts);
      }

      const processActionType = {
      'DIRECT_LINE/CONNECT_FULFILLED':  processActionConnectFulfilled(options),
      'DIRECT_LINE/INCOMING_ACTIVITY': processIncomingActivity(options),
      'WEB_CHAT/SEND_MESSAGE': sendMessageActivity(options),
    };

    const canProcessAction = processActionType[action.type];
    if (canProcessAction) processActionType[action.type]();
      let nxt = null;
      if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
          if (action.payload.activity.text !== undefined) {
             // console.log(`activity text = ${action.payload.activity.text}`)
              if (prevTexts.includes(action.payload.activity.text) == false) {
                  prevTexts.push(action.payload.activity.text)
                  nxt = next(action)
              }
          }
          else {
              nxt = next(action)
          }
       }
      else {
          nxt = next(action)
      }

    return nxt;
  },
};

export default StartConvoAndTrackUtterances;
