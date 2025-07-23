import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { SendKey } from "./actions/sendkey";


streamDeck.logger.setLevel(LogLevel.INFO);

// Register the actions.
streamDeck.actions.registerAction(new SendKey());

// Finally, connect to the Stream Deck.
streamDeck.connect();
