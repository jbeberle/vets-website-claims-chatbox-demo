./term.sh "cd ~/IdeaProjects/vets-website-claims-chatbox-demo && prism mock -p 3002 va.json"
./term.sh "cd ~/IdeaProjects/va-call-bot-demo && azurite --silent --location ../azurite"
./term.sh "cd ~/IdeaProjects/va-call-bot-demo && yarn install --ignore-engines && yarn watch"
./term.sh "cd ~/IdeaProjects/va-call-api-demo && mvn spring-boot:run"
./term.sh "cd ~/IdeaProjects/va-call-browser-demo && yarn install --ignore-engines && yarn start"
./term.sh " cd ~/IdeaProjects/va-call-mobile-demo/VAMobile && yarn install && yarn bundle:android && yarn android"
./term.sh "cd ~/IdeaProjects/vets-website-claims-chatbox-demo && yarn install --ignore-engines && yarn watch --env api=http://127.0.0.1:3002"
open /Applications/Bot\ Framework\ Emulator.app
# open "/Applications/Google\ Chrome.app/" --args --disable-web-security "http://127.0.0.1:3001/contact-us/virtual-agent"
open "/Applications/Google\ Chrome.app/" --args --disable-web-security
