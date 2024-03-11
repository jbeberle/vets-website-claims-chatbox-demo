import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import environment from "platform/utilities/environment";
import { apiRequest } from "platform/utilities/api";
import recordEvent from "platform/monitoring/record-event";
import { isMobile } from "react-device-detect"; // Adding this library for accessibility reasons to distinguish between desktop and mobile
import { ERROR } from "../chatbox/loadingStatus";
// import PropTypes from 'prop-types';
import StartConvoAndTrackUtterances from "./startConvoAndTrackUtterances";
import MarkdownRenderer from "./markdownRenderer";
import { clearBotSessionStorage, CONVERSATION_ID_KEY, IS_RX_SKILL, LOGGED_IN_FLOW, TOKEN_KEY } from "../chatbox/utils";
import { cardActionMiddleware, hasAllParams, ifMissingParamsCallSentry } from "./helpers/webChat";

const renderMarkdown = text => MarkdownRenderer.render(text);
// DIRECTLINE_USE_POLLING must be set to true if using offline_directline
const DIRECTLINE_USE_POLLING = true;
// const DIRECTLINE_HOSTNAME = 'https://northamerica.directline.botframework.com/v3/directline';
const DIRECTLINE_HOSTNAME = 'http://localhost:3000/directline';
const POLLING_INTERVAL_MS = 1000; // Only used if DIRECTLINE_USE_POLLING = true


    export const setMicrophoneMessage = (isRXSkill, theDocument) => () => {
  let intervalId;
  if (isRXSkill === "true") {
    intervalId = setTimeout(() => {
      const sendBox = theDocument.querySelector(
        "input[class=\"webchat__send-box-text-box__input\"]"
      );
      const attributeSetAMessage = attr =>
        sendBox?.setAttribute(attr, "Type or enable the microphone to speak");

      ["aria-label", "placeholder"].forEach(attributeSetAMessage);
    }, 0); // delay this code until all synchronous code runs.
  }
  return () => clearTimeout(intervalId);
};

const WebChat = ({
                   token,
                   WebChatFramework,
                   apiSession,
                   setParamLoadingStatus
                 }) => {
  console.log("1st line of WebChat")
  const { ReactWebChat, createDirectLine, createStore } = WebChatFramework;
  const csrfToken = localStorage.getItem("csrfToken");
  const userFirstName = useSelector(state =>
    _.upperFirst(_.toLower(state.user.profile.userFullName.first))
  );
  const userUuid = useSelector(state => state.user.profile.accountUuid);
  const isLoggedIn = useSelector(state => state.user.login.currentlyLoggedIn);
  console.log("in WebChat")

  ifMissingParamsCallSentry(csrfToken, apiSession, userFirstName, userUuid);
  if (!hasAllParams(csrfToken, apiSession, userFirstName, userUuid)) {
    // if this component is rendered then we know that the feature toggles are
    // loaded and thus we can assume all the params are available if not we
    // should error out
    setParamLoadingStatus(ERROR);
  }

  const store = useMemo(
    () => {
      console.log("Handling WebChat");
      return createStore(
        {},
        StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
          csrfToken,
          apiSession,
          process.env.VIRTUAL_AGENT_BACKEND_URL || environment.API_URL,
          environment.BASE_URL,
          userFirstName === "" ? "noFirstNameFound" : userFirstName,
          userUuid === null ? "noUserUuid" : userUuid, // Because PVA cannot support empty strings or null pass in 'null' if user is not logged in
          isMobile
        )
      );
    },
    [createStore]
  );

  console.log("store=")
  console.log(store)
  let directLineToken = token;
  let conversationId = "";
  let directLine = {};
  //let directLine = useSelector((state) => state.orders.directLine);

  // eslint-disable-next-line sonarjs/no-collapsible-if

  console.log("before sessionStorage stuff")
  console.log(directLineToken)
  if (sessionStorage.getItem(LOGGED_IN_FLOW) === "true" && isLoggedIn) {
    console.log("generating new token")
    directLineToken = sessionStorage.getItem(TOKEN_KEY);
    conversationId = sessionStorage.getItem(CONVERSATION_ID_KEY);
  }
  else {
    console.log("using existing token")
  }

  addEventListener("beforeunload", () => {
    console.log("beforeunload")
    clearBotSessionStorage(false, isLoggedIn);
  });

  console.log("before querySelectorAll")
  const links = document.querySelectorAll("div#account-menu ul li a");
  if (links && links.length) {
    const link = links[links.length - 1];
    if (link.innerText === "Sign Out") {
      link.addEventListener("click", () => {
        clearBotSessionStorage(true);
      });
    }
  }

  if(DIRECTLINE_USE_POLLING == true) {
    directLine = useMemo(
        () =>
            createDirectLine({
              token: directLineToken,
              domain: DIRECTLINE_HOSTNAME,
              conversationId,
              watermark: conversationId,
              webSocket: false,
              pollingInterval: POLLING_INTERVAL_MS,
            }),
        [createDirectLine],
    );
  } else {
    directLine = useMemo(
        () =>
            createDirectLine({
              token: directLineToken,
              domain: DIRECTLINE_HOSTNAME,
              conversationId,
              watermark: conversationId,
            }),
        [createDirectLine],
    );

  }


  // The following section of code uses the offline-directline npm package.  If
  // Not present and running, this will not work.
  //
  // console.log("before directLine create")
  // directLine = useMemo(
  //   () =>
  //     createDirectLine({
  //       token: directLineToken,
  //       domain:
  //         'http://localhost:3978/directline',
  //       conversationId,
  //       watermark: '',
  //     }),
  //   [createDirectLine]
  // );

  console.log("after directLine")

  const BUTTONS = 49.2;

  const styleOptions = {
    hideUploadButton: true,
    botAvatarBackgroundColor: "#003e73",
    botAvatarInitials: "VA",
    userAvatarBackgroundColor: "#003e73",
    userAvatarInitials: "You",
    primaryFont: "Source Sans Pro, sans-serif",
    bubbleBorderRadius: 5,
    bubbleFromUserBorderRadius: 5,
    bubbleBorderWidth: 0,
    bubbleFromUserBorderWidth: 0,
    bubbleBackground: "#e1f3f8",
    bubbleFromUserBackground: "#f1f1f1",
    bubbleNubSize: 10,
    bubbleFromUserNubSize: 10,
    timestampColor: "#000000",
    suggestedActionLayout: "stacked",
    suggestedActionsStackedHeight: BUTTONS * 5,
    suggestedActionActiveBackground: "rgb(17,46,81)",
    suggestedActionBackgroundColorOnHover: "rgb(0,62,115)",
    suggestedActionBackgroundColor: "rgb(0, 113, 187)",
    suggestedActionTextColor: "white",
    suggestedActionBorderRadius: 5,
    suggestedActionBorderWidth: 0,
    microphoneButtonColorOnDictate: "rgb(255, 255, 255)"
  }; // color-primary-darker // color-primary-darker

  const handleTelemetry = event => {
    const { name } = event;

    console.log("in handleTelemetry")
    if (name === "submitSendBox") {
      recordEvent({
        event: "cta-button-click",
        "button-type": "default",
        "button-click-label": "submitSendBox",
        "button-background-color": "gray",
        time: new Date()
      });
    }
    console.log("after handleTelemetry")
  };

  async function createPonyFill(webchat) {
    console.log("createPonyFill")
    const region =
      environment.isDev() || environment.isLocalhost() ? "eastus" : "eastus2";

    async function callVirtualAgentVoiceTokenApi() {
      console.log("callVirtualAgentVoiceTokenApi:  posting virtual_agent_speech_token");
      const x = apiRequest("/virtual_agent_speech_token", { method: "POST" });
      console.log("successful return");
      return apiRequest("/virtual_agent_speech_token", { method: "POST" });
    }

    const speechToken = await callVirtualAgentVoiceTokenApi();
    return webchat.createCognitiveServicesSpeechServicesPonyfillFactory({
      credentials: {
        region,
        authorizationToken: speechToken.token
      }
    });
  }

  const [speechPonyfill, setBotPonyfill] = useState();

  useEffect(() => {
    createPonyFill(window.WebChat).then(res => {
      setBotPonyfill(() => res);
    });
  }, []);
  const [isRXSkill, setIsRXSkill] = useState();
  useEffect(
    () => {
      const getRXStorageSession = () => {
        console.log("getting RXStorageSession")
        return setIsRXSkill(() => sessionStorage.getItem(IS_RX_SKILL));
      }

      window.addEventListener("rxSkill", getRXStorageSession);
      return () => window.removeEventListener("rxSkill", getRXStorageSession);
    },
    [isRXSkill]
  );

  useEffect(setMicrophoneMessage(isRXSkill, document));

  if (isRXSkill === "true") {
    console.log("Creating ReactWebChat: directLine=")
    console.log(directLine)
    return (
      <div data-testid="webchat" style={{ height: "550px", width: "100%" }}>
        <ReactWebChat
          styleOptions={styleOptions}
          directLine={directLine}
          store={store}
          renderMarkdown={renderMarkdown}
          onTelemetry={handleTelemetry}
          webSpeechPonyfillFactory={speechPonyfill}
        />
      </div>
    );
  }
  if (window.WebChat && isRXSkill !== "true") {
    console.log("in WebChat && isRXSkill")
    // find the send box element
    const sendBox = document.querySelector(
      "input[class=\"webchat__send-box-text-box__input\"]"
    );
    // change the placeholder text of send box back to the default if it isn't already
    if (
      document.querySelector(
        "input[placeholder=\"Type or enable the microphone to speak\"]"
      )
    ) {
      sendBox.setAttribute("aria-label", "Type your message");
      sendBox.setAttribute("placeholder", "Type your message");
    }
  }
  console.log("Creatting ReactWebChat")
  const rwc = (
    <div data-testid="webchat" style={{ height: "550px", width: "100%" }}>
      <ReactWebChat
        cardActionMiddleware={cardActionMiddleware}
        styleOptions={styleOptions}
        directLine={directLine}
        store={store}
        renderMarkdown={renderMarkdown}
        onTelemetry={handleTelemetry}
      />
    </div>
  );
  console.log("Done creating ReactWebChat")
  return rwc;
};

export default WebChat;
