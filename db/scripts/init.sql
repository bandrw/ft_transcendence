CREATE TABLE "users"
(
	"id" serial PRIMARY KEY,
	"login" VARCHAR(16) UNIQUE,
	"password" TEXT,
	"url_avatar" TEXT,
	"intraLogin" TEXT
);

CREATE TABLE "games_history"
(
	"id" serial PRIMARY KEY,
	"winnerId" INTEGER,
	"loserId" INTEGER,
	"leftScore" INTEGER,
	"rightScore" INTEGER,
	"date" TIMESTAMP DEFAULT NOW() NOT NULL,

	CONSTRAINT "fk_winner"
		FOREIGN KEY("winnerId")
		REFERENCES "users"("id")
		ON DELETE SET NULL,

	CONSTRAINT "fk_loser"
		FOREIGN KEY("loserId")
		REFERENCES "users"("id")
		ON DELETE SET NULL
);

CREATE TABLE "user_subscriptions"
(
	"id" serial PRIMARY KEY,
	"userId" INTEGER,
	"targetId" INTEGER,

	CONSTRAINT "fk_user"
		FOREIGN KEY("userId")
		REFERENCES "users"("id")
		ON DELETE SET NULL,

	CONSTRAINT "fk_target"
		FOREIGN KEY("targetId")
		REFERENCES "users"("id")
		ON DELETE SET NULL
);

CREATE TABLE "chats"
(
	"id" serial PRIMARY KEY,
	"userOneId" INTEGER,
	"userTwoId" INTEGER,

	CONSTRAINT "fk_userOne"
		FOREIGN KEY("userOneId")
		REFERENCES "users"("id")
		ON DELETE SET NULL,

	CONSTRAINT "fk_userTwo"
		FOREIGN KEY("userTwoId")
		REFERENCES "users"("id")
		ON DELETE SET NULL
);

CREATE TABLE "channels"
(
	"id" serial PRIMARY KEY,
	"name" VARCHAR(16) UNIQUE,
	"title" TEXT,
	"isPrivate" BOOLEAN,
	"password" TEXT,
	"ownerId" INTEGER,

	CONSTRAINT "fk_ownerId"
		FOREIGN KEY("ownerId")
		REFERENCES "users"("id")
		ON DELETE SET NULL
);

CREATE TABLE "channel_members"
(
	"id" serial PRIMARY KEY,
	"channelId" INTEGER,
	"userId" INTEGER,
	"isAdmin" BOOLEAN DEFAULT FALSE,

	CONSTRAINT "fk_channelId"
		FOREIGN KEY("channelId")
		REFERENCES "channels"("id")
		ON DELETE CASCADE,

	CONSTRAINT "fk_userId"
		FOREIGN KEY("userId")
		REFERENCES "users"("id")
		ON DELETE CASCADE
);

CREATE TABLE "messages"
(
	"id" serial PRIMARY KEY,
	"chatId" INTEGER,
	"channelId" INTEGER,
	"fromUserId" INTEGER,
	"text" TEXT,
	"date" TIMESTAMP DEFAULT NOW() NOT NULL,

	CONSTRAINT "fk_chatId"
		FOREIGN KEY("chatId")
		REFERENCES "chats"("id")
		ON DELETE SET NULL,

	CONSTRAINT "fk_channelId"
		FOREIGN KEY("channelId")
		REFERENCES "channels"("id")
		ON DELETE SET NULL,

	CONSTRAINT "fk_fromUserId"
		FOREIGN KEY("fromUserId")
		REFERENCES "users"("id")
		ON DELETE SET NULL
);

CREATE TABLE "ban_lists"
(
	"id" serial PRIMARY KEY,
	"initiatorId" INTEGER,
	"memberId" INTEGER,
	"chatId" INTEGER,
	"channelId" INTEGER,
	"unbanDate" TIMESTAMP,

	CONSTRAINT "fk_initiatorId"
		FOREIGN KEY("initiatorId")
		REFERENCES "users"("id")
		ON DELETE SET NULL,

	CONSTRAINT "fk_memberId"
		FOREIGN KEY("memberId")
		REFERENCES "users"("id")
		ON DELETE CASCADE,

	CONSTRAINT "fk_chatId"
		FOREIGN KEY("chatId")
		REFERENCES "chats"("id")
		ON DELETE CASCADE,

	CONSTRAINT "fk_channelId"
		FOREIGN KEY("channelId")
		REFERENCES "channels"("id")
		ON DELETE CASCADE
);
