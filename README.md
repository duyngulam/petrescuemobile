# petrescuemobile

React native mobile for pet rescue system
src/
├── app/ # entry + navigation root
├── screens/ # màn hình (pages)
├── components/ # UI components tái sử dụng
├── features/ # business logic theo domain
├── services/ # API, socket, external services
├── store/ # state management
├── hooks/ # custom hooks
├── utils/ # helper functions
├── constants/ # config, enum
├── assets/ # images, fonts
├── types/ # TypeScript types
└── config/ # env, setup lib

## Geo realtime map (OpenStreetMap + WebSocket)

- Map screen: `app/(tabs)/index.tsx`
- Platform split:
  - native: `app/(tabs)/index.native.tsx` (react-native-maps)
  - web: `app/(tabs)/index.web.tsx` (không import native maps)
- Base API: `constants/api.ts` (đọc từ `app.json > expo.extra`)
- Geo REST:
  - `GET /geo/nearby?radiusKm=2&limit=50`
  - `PUT /geo/me/location`
- WebSocket subscribe:
  - destination: `/user/queue/geo/updates`
- Đăng nhập JWT trước khi tracking:
  - `POST /auth/login` với `emailOrUsername`, `password`
  - App lưu `accessToken` trong AuthContext và dùng token này cho geo APIs + websocket.

### Cấu hình

`app.json`:
- `expo.extra.apiBaseUrl`
- `expo.extra.wsBaseUrl`

### Chạy

1. `npm install`
2. `npm run android` hoặc `npm run ios`
3. Dán bearer token vào ô token trên màn hình Home để bật realtime geo.
