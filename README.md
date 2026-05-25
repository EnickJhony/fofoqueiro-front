# Fofoqueiro Front

Frontend básico em React com Vite.

## Rodar

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Configurar porta

Use o arquivo `.env` na raiz do projeto para definir `PORT` em desenvolvimento. Há também um modelo em `.env.example`.

Exemplo em `.env` ou `.env.example`:

```
PORT=3000
```

Para rodar em uma porta diferente temporariamente:

- Linux / macOS:

```
PORT=4000 npm run dev
```

- Windows (PowerShell):

```
$env:PORT=4000; npm run dev
```

- Windows (CMD):

```
set PORT=4000 && npm run dev
```

