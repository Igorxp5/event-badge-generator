# Event Badge Generator

**Event Badge Generator** é um serviço que tem como objetivo gerar crachás em massa a partir de um template **PSD** e de dados copiados de uma **planilha do Excel**.

## Introdução

Para executar o serviço instale os pré-requisitos antes de rodar o programa.

## Pré-Requisitos

Tenha instalado em sua máquina o **Python 3**.

## Instalação

Siga os passos abaixo para executar o serviço. Primeiramente clone deste repositório o projeto:

```
git clone https://github.com/Igorxp5/event-badge-generator.git
```

Na pasta raiz do projeto, instale as dependências dos projetos executando:

```
pip install -r requirements.txt
```

Caso não possua permissão de administrador da máquina execute:

```
pip install -r requirements.txt --user
```

## Executando

Para executar a aplicação, rode no Python o script principal, utilizando o seguinte código:

```
python server.py
```

## Acesse o website

Acess o serviço colocando em seu navegador o endereço: ```http://localhost:3000```.

## Captura de Tela

![Captura de Tela do Web Site](https://user-images.githubusercontent.com/8163093/53912779-6ba78e00-4038-11e9-9cf2-3b75f201aae8.png)

## Biblioteca adicional desenvolvida

Para construir o projeto foi desenvolvido uma biblioteca em Python para realizar a operação de carregar um arquivo PSD e aplicar um conjunto de dados. Ela pode ser acessada na branch ```psd-templater-png```.

## Licença

Este projeto está licenciado sobre a MIT LICENSE - [LICENSE](LICENSE).