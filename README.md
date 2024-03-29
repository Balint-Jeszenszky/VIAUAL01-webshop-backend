# Webshop backend made for BME VIK AUT Project Laboratory - VIAUAL01

##  Információk a projectről:

A projekt BME VIK AUT önálló laboratóriumra készült webshop webalkalmazás backendje. A frontend itt érhető el: [frontend](https://github.com/Balint-Jeszenszky/VIAUAL01-webshop-frontend)

## Beüzemelés

### Szükséges szoftverek

- Node.js (12-es és 14-es verzióval tesztelve)
- npm (Node.js-el települ, 7-es verzióval készült)

### Környezeti változók beállítása

Létre kell hozni a projekt gyökerében egy `.env` fájlt a következő tartalommal:
- SERVER_PORT={number}
    - ezen a porton fog futni a szerver, nem kötelező

- DB_CONN={url}
    - mongodb url-je, pl: mongodb://localhost/webshop

- MAPS_API_KEY={apiKey}
    - api kulcs google maps-hez google cloud platformról

- DEFAULT_CURRENCY={currency}
    - ez lesz az alapértelmezett pénznem a webshopban pl: HUF

- LOG_FILE={filename}
    - log fájl neve, nem közelező
    - ha nincs megadva akkor access.log lesz

- CURRENCY_UPDATE_HOUR={number}
    - árfolyamok frissítésének az órájs, pl 4 esetén minden nap hajnali 4 órakor fog frissülni

- ACCESS_TOKEN_SECRET={privateKey}
    - random byte sorozat, titkos kulcs a tokenek generálásához
    - generálása pl: `require('crypto').randomBytes(64).toString('hex')` parancs segítségével

- REFRESH_TOKEN_SECRET={privateKey}
    - random byte sorozat, titkos kulcs a JWT tokenek generálásához
    - generálása pl: `require('crypto').randomBytes(64).toString('hex')` parancs segítségével

- ACCESS_TOKEN_EXPIRATION={duration}
    - token élettartama pl 10m esetén 10 perc

- REFRESH_TOKEN_EXPIRATION={duration}
    - token élettartama pl 4h esetén 4 óra

- VAPID_PUBLIC_KEY={publicKey}
    - vapid publikus kulcs a push értesítésekhez
    - generálás: `require('web-push').generateVAPIDKeys()` javascript kódból vagy `.\node_modules\.bin\web-push generate-vapid-keys` parancssorból a projekt könyvtárában

- VAPID_PRIVATE_KEY={privateKey}
    - vapid privát kulcs a push értesítésekhez
    - az előző pontban írt generálásnál létre jön

- ADMIN_PASSWORD={password}
    - admin alapértelmezett jelszava, érdemes első indítás után megváltoztatni a webes felületen

- ADMIN_EMAIL={email}
    - admin email címe, barionra ez legyen regisztrálva

- EXCHANGERATES_API_KEY={apiKey}
    - exchangerates api kulcs, [exchangeratesapi.io](https://exchangeratesapi.io/) regisztráció után ingyen generálható

- BARION_POSKEY={privateKey}
    - barionon regisztrált bolt titkos azonosítója (POSKey)

- WEBSITE_BASE_URL={url}
    - a publikus weboldalunk url-je pl webshopom.com

### Telepítés, futtatás

Projekt gyökerében megnyitott konzolon a következő parancsok érhetők el:

- `npm install` - telepítés
- `npm run dev` - development szerver indítása, változtatások után automatikusan újraindul
- `npm run build` - build folyamat futtatása, a build mappában lesz megtalálható a lefordított projekt
- `npm run prod` - production build futtatása, a build lefutása után egyből futtatja a szervert is
- `npm run test` - tesztek futtatása

Frontend kiszolgálása:

- hozzunk létre egy mappát `static` néven a projekt gyökerében
- másoljuk bele a frontend buildelt verzióját
