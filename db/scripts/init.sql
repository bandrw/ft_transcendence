CREATE TABLE "users"
(
	"id" serial PRIMARY KEY,
	"login" TEXT UNIQUE,
	"password" TEXT,
	"url_avatar" TEXT
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
