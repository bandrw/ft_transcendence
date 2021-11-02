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
)
