process.env.TZ = "Asia/Tokyo";

const {App} = require("@slack/bolt");
const _ = require("lodash");

const Homeview = require("./views/home");
const ModalView = require("./views/modal");

const receiversString = process.env.RECEIVERS
const receivers = []
for (const receiverString of receiversString.split(",")) {
	const receiver = receiverString.split(":")
	receivers.push({display_name: receiver[0], channel: receiver[1]})
}

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const assert = require("assert");

const mongoOptions = {
	useUnifiedTopology: true
}

const dbName = process.env.DB_NAME;
const dbUserName = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;


MongoClient.connect(`mongodb://${dbUserName}:${dbPassword}@mongo:27017`, mongoOptions,function (err, client) {
	assert.equal(null, err);
	console.log("Connected to mongodb");

	const db = {};
	db.user = client.db(dbName).collection("user");
	db.post = client.db(dbName).collection("post");

	const app = new App({
		signingSecret: process.env.SLACK_SIGNING_SECRET,
		token: process.env.SLACK_BOT_TOKEN,
	});

// ホームビューが表示されたときの処理
	app.event("app_home_opened", async ({event, context, say}) => {
		db.user
			.find({_id: event.user})
			.toArray((err, data) => {
				assert.equal(err, null);
				if (data.length < 1) {
					const user = {
						_id: event.user,
					};
					db.user.insertOne(user, (err, data) => {
						say(
							`<@${event.user}>さん、目安箱へようこそ。\nここでは上の「ホーム」タブから気軽に意見を送ることができます。\n(システム上このメッセージタブに返信をいただいても届きませんのでご了承ください。)`,
						);
					});
				}
			});

		if ("home" == event.tab) {
			db.post
				.find({"sender.id": event.user})
				.sort({created_at: -1})
				.toArray((err, data) => {
					assert.equal(err, null);
					app.client.views.publish({
						token: context.botToken,
						user_id: event.user,
						view: Homeview.getHomeview(data),
					});
				});
		}
	});

// 新規投稿ボタンが押されたときの処理
	app.action("home_new_post_modal", async ({body, ack, context}) => {
		ack();
		await app.client.views.open({
			token: context.botToken,
			trigger_id: body.trigger_id,
			view: ModalView.getModalView(),
		});
	});

// 投稿が送信されたときの処理
	app.view("send_post", async ({ack, body, context, view}) => {
		ack();

		// モーダル入力値取得
		const receiver_id = parseInt(_.get(view.state.values, [
			"receiver",
			"input_value",
			"selected_option",
			"value",
		]));
		const input_text = _.get(view.state.values, [
			"input_text",
			"input_value",
			"value",
		]);
		const is_anonymous = _.get(view.state.values, [
			"is_anonymous",
			"input_value",
			"selected_options",
			0,
			"value",
		]);

		const default_receiver = receivers.find((item) => {
			return item.display_name === process.env.DEFAULT_RECEIVER
		})

		let send_text = "";
		let channel = default_receiver.channel;
		if (receiver_id in receivers) {
			channel = receivers[receiver_id].channel;
		}

		if (is_anonymous) {
			send_text += "目安箱に匿名で投稿がありました。\n";
		} else {
			send_text += `目安箱に<@${body.user.id}>さんより投稿がありました。\n`;
		}
		send_text +=
			">　\n" +
			input_text.replace(/^(.*)$/gm, "> $1") + "\n" +
			">　\n" +
			"(この発言のスレッドに投稿することで返信することができます。)\n";
		app.client.chat
			.postMessage({
				token: context.botToken,
				text: send_text,
				channel: channel,
			})
			.then(res => {
				const post = {
					_id: res.message.ts,
					text: input_text,
					sender: {
						id: body.user.id,
					},
					receiver: {
						id: receiver_id,
					},
					is_anonymous: Boolean(is_anonymous),
					replies: [],
					created_at: new Date(res.message.ts * 1000),
				};
				db.post.insertOne(post, function (err, newdata) {
					db.post
						.find({"sender.id": body.user.id})
						.sort({created_at: -1})
						.toArray((err, data) => {
							assert.equal(err, null);
							app.client.views.publish({
								token: context.botToken,
								user_id: body.user.id,
								view: Homeview.getHomeview(data),
							});
						});
				});
			});
	});

// メッセージを受け取ったときの処理
	app.message(async ({message, context, say}) => {
		db.post.findOne({_id: message.thread_ts}, (err, data) => {
			if (data) {
				db.post.updateOne(
					{_id: message.thread_ts},
					{
						$push: {
							replies: {
								_id: message.ts,
								text: message.text,
								sender: {
									id: message.user,
								},
								created_at: new Date(message.ts * 1000),
							},
						},
					},
					(err, count) => {
						const posttext = `あなたの投稿に<@${
							message.user
						}>さんから返信が届きました。
>　
${message.text.replace(/^(.*)$/gm, "> $1")}
>　
(詳細は「ホーム」タブにてご確認ください。\n返信を送りたい場合は「ホーム」タブより新しく送信をお願いします。)`;
						app.client.chat.postMessage({
							token: context.botToken,
							text: posttext,
							channel: data.sender.id,
						});
					},
				);
			}
		});
	});

// アプリ起動処理
	(async () => {
		await app.start(8080);
		console.log("Meyasubako is running!");
	})();

});
