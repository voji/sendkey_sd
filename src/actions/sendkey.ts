import { action, KeyDownEvent, KeyUpEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const winnapi = require("./addons/winnapi.node");

/**
 * Sends a key event to the operating system.
 */
@action({ UUID: "hu.voji.keyboard.sendkey" })
export class SendKey extends SingletonAction<SendKeySettings> {

	/**
	 * Listens for the {@link SingletonAction.onKeyDown} event which is emitted by Stream Deck when an action is pressed. Stream Deck provides various events for tracking interaction
	 * with devices including key down/up, dial rotations, and device connectivity, etc. When triggered, {@link ev} object contains information about the event including any payloads
	 * and action information where applicable. 
	 */
	override async onKeyDown(ev: KeyDownEvent<SendKeySettings>): Promise<void> {
		const { settings } = ev.payload;
		var shift = typeof settings.mod_shift === 'boolean' ? settings.mod_shift : false;
		var ctrl = typeof settings.mod_ctrl === 'boolean' ? settings.mod_ctrl : false;
		var alt = typeof settings.mod_alt === 'boolean' ? settings.mod_alt : false;
		var win = typeof settings.mod_win === 'boolean' ? settings.mod_win : false;
		winnapi.sendKeyDown(settings.hotkey, shift, ctrl, alt, win);
	}

	override async onKeyUp(ev: KeyUpEvent<SendKeySettings>): Promise<void> {
		const { settings } = ev.payload;
		var shift = typeof settings.mod_shift === 'boolean' ? settings.mod_shift : false;
		var ctrl = typeof settings.mod_ctrl === 'boolean' ? settings.mod_ctrl : false;
		var alt = typeof settings.mod_alt === 'boolean' ? settings.mod_alt : false;
		var win = typeof settings.mod_win === 'boolean' ? settings.mod_win : false;
		winnapi.sendKeyUp(settings.hotkey, shift, ctrl, alt, win);
	}
}

/**
 * Settings for {@link SendKey}.
 */
type SendKeySettings = {
	hotkey: string;
	mod_shift: boolean;
	mod_ctrl: boolean;
	mod_alt: boolean;
	mod_win: boolean;
};
