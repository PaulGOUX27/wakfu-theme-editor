import axios from "axios";

const wakfuCDNClient = axios.create({
    baseURL: 'https://wakfu.cdn.ankama.com/gamedata/',
})

export async function downloadJSONThemeFromWakfu() {
    const res = await wakfuCDNClient.get("theme/theme.json", {
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
    }});

    return res.data
}