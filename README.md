# fetch-pullrequests
CLI para buscar pullrequests no Azure DevOps Repos

## Configs pré instalação
- Criar uma pasta onde será guardado o arquivo de configuração. Sugestão `.fetch-pullrequests`
- Dentro desta pasta, criar um arquivo `configs.js` com o seguinte conteúdo:
    ```js
        const AZURE_PAT = "SEU-TOKEN-DO-AZURE" // Gerado no Azure Devops em Users settings / Personal access tokens
        const ORGANIZATION = 'SUA-ORGANIZAÇÃO';
        const PROJECT = 'SEU-PROJETO';
        const REPOS = [
            "id-do-repo1",
            "id-do-repo2",
            "etc"
        ];
        const REVIEWER = 'NOME DO REVISOR PARA FILTRAR OS PULL REQUESTS'
        module.exports = { AZURE_PAT, ORGANIZATION, PROJECT, REPOS, REVIEWER };
    ```

- Configurar uma variável de ambiente com o nome `FETCH_PR` apontando para a pasta onde o arquivo configs.js foi criado.

### Desenvolvimento
Executar `npm i -g` na raiz do projeto.

### Instalação global
Executar `npm i -g fetch-pullrequests` para instalar o projeto.

### Execução
Após a instalação global, executar `fetch-pullrequests` em qualquer local.
Executar `fetch-pullrequests -h` para obter ajuda.
