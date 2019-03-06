# PSD Templater PNG

**PSD Templater PNG** é uma biblioteca para renderizar um PSD substituindo seu conteúdo por dados passados no formato JSON. A biblioteca possui uma **CLI**.

## Introdução

Para executar a biblioteca instale os pre-requisitos.

### Prerequisites

Tenha instalado em sua máquina o **Python 3**.

### Instalação

Siga os passos abaixo para executar a biblioteca. Baixe a biblioteca deste repositório.

Na pasta raiz do projeto, instale as dependências dos projetos executando:

```
pip install -r requirements.txt
```

Caso não possua permissão de administrador da máquina execute:

```
pip install -r requirements.txt --user
```

## Interface de Linha de Comando

A biblioteca possue uma interface de linha de comando que pode ser executada através de:

```
pyhton pytemplater.py
```

O **help** da biblioteca pode ser acessado utilizando:
```
pyhton pytemplater.py --help
```

## TODO

Alguns módulos não estão presentes no **CLI** como: ```create_template```, ```apply_template```.

## Licença

Este projeto está licenciado sobre a MIT LICENSE - [LICENSE](LICENSE).