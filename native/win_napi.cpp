#include "../node_modules/node-addon-api/napi.h"
#include <windows.h>

WORD getVirtualKeyFromChar(char c) {
    SHORT vk = VkKeyScanA(c);
    if (vk == -1) return 0;
    return LOBYTE(vk);
}

void sendInput(bool down, WORD vk) {
    
    INPUT input = {0};
    input.type = INPUT_KEYBOARD;
    input.ki.wVk = vk;
    input.ki.dwFlags = down ? 0 : KEYEVENTF_KEYUP;

    SendInput(1, &input, sizeof(INPUT));
}

void sendKey(bool down, const Napi::CallbackInfo& info) {
    bool modShift = info[1].As<Napi::Boolean>();
    if (modShift) sendInput(down, VK_SHIFT);
    bool modCtrl = info[2].As<Napi::Boolean>();
    if (modCtrl) sendInput(down, VK_CONTROL);
    bool modAlt = info[3].As<Napi::Boolean>();
    if (modAlt) sendInput(down, VK_MENU);
    bool modWin = info[4].As<Napi::Boolean>();
    if (modWin) sendInput(down, VK_LWIN);
    if (info[0].IsString()) {
        std::string key = info[0].As<Napi::String>();
        if (key.length() == 1) {
            char firstChar = key[0];    
            WORD vk = getVirtualKeyFromChar(firstChar);
            if (vk > 0) {
                sendInput(down, vk);
            }
        }
    }
}

Napi::Value SendKeyDown(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();    
    sendKey(true, info);
    return env.Undefined();
}

Napi::Value SendKeyUp(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    sendKey(false, info);
    return env.Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("sendKeyDown", Napi::Function::New(env, SendKeyDown));
    exports.Set("sendKeyUp", Napi::Function::New(env, SendKeyUp));
    return exports;
}

NODE_API_MODULE(key_sender, Init)
