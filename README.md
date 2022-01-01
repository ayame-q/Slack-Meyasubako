# SlackMeyasubako

Digital Suggestion Box Bot on Slack
(Slackで簡易的な目安箱機能を実現するBot)

## Install and Run
1. Config Slack Bot on [Slack API](https://api.slack.com/apps) (see [Slack Requirements](#Slack-Requirements))
2. Clone Repository
3. Make .env file (see [Config](#Config))
4. Run `docker-compose up -d --build`
(If you run on docker-compose for Production[Unrecommended],
Run `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`)

## Config
### .env
```
PORT=8080
TZ=Asia/Tokyo
DB_NAME=meyasubako
DB_USERNAME=root
DB_PASSWORD=changeit
MONGO_INITDB_DATABASE=meyasubako
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=changeit
SLACK_SIGNING_SECRET=[Slack Signing Secret]
SLACK_BOT_TOKEN=[Slack Bot Token]
RECEIVERS="委員長&副委員長:#目安箱_最高幹部,委員長:U000000,副委員長:U000000
DEFAULT_RECEIVER=委員長&副委員長
```

## Slack Requirements

* A Bot User
* Subscribed to Events

### Scopes

* [`chat:write`](https://api.slack.com/scopes/chat:write)
* [`groups:history`](https://api.slack.com/scopes/groups:history)
* [`im:history`](https://api.slack.com/scopes/im:history)

### Events

#### Workspace events

* [`app_home_opened`](https://api.slack.com/events/app_home_opened)
* [`message.groups`](https://api.slack.com/events/message.groups)
* [`message.im`](https://api.slack.com/events/message.im)


## Dependent libraries

* [Slack Bolt](https://slack.dev/bolt/concepts)
* [LoDash](https://lodash.com/docs/)
* [MongoDB](http://mongodb.github.io/node-mongodb-native/)
* [Day.js](https://github.com/iamkun/dayjs)


## Author

ayame.space(ayame.space@gmail.com)
