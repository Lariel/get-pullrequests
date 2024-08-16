# get-pullrequests
CLI para buscar pullrequests no Azure DevOps Repos

## Configs pré instalação
- Criar uma pasta onde será guardado o arquivo de configuração. Sugestão `.fetch-pullrequests`
- Dentro desta pasta, criar um arquivo `configs.js` com o seguinte conteúdo:
    ```js
        const ORGANIZATION = 'SUA-ORGANIZAÇÃO';
        const PROJECT = 'SEU-PROJETO';
        const REPOS = [
            "id-do-repo1",
            "id-do-repo2",
            "etc"
        ];
        const REVIEWER = 'NOME DO REVISOR PARA FILTRAR OS PULL REQUESTS'
        module.exports = { REPOS, ORGANIZATION, PROJECT, REVIEWER };
    ```

### Desenvolvimento (instalação local)
Executar `npm i -g` na raiz do projeto.

### Instalação global
Executar `npm i -g fetch-pullrequests` para instalar o projeto.

### Execução
Após a instalação global, executar `fetch-pullrequests` em qualquer local.
