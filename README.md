# carpool-confirmer-api
API para minha implementação do teste de recrutamento da Bynd

A API tem um banco de dados em memória e possui cinco endpoints:

- `POST /ride`: Inicia uma nova corrida. Retorna o QR Code como dataURL e o ID da corrida, que deve  ser utilizado nos demais endpoints.
- `GET /ride/:id`: Retorna as informações da corrida. Utilizada pelo motorista para garantir que o usuário já tenha escaneado o código antes de prosseguir.
- `POST /ride/:id/scan-passenger`: Chamado quando o passageiro escaneia o QRCode da corrida.
- `POST /ride/:id/confirm-driver`: Confirma a localização do motorista.
- `POST /ride/:id/confirm-passenger`: Confirma a localização do passageiro.

Para fins de teste, a API encontra-se hospedada em 45.79.185.51:3000.
