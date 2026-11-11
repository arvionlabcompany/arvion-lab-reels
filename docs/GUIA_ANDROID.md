# Guia Android — Arvion Lab Reel IA

## Visão geral
O Android será usado para controlar o repositório. A renderização acontece em um runner Linux do GitHub Actions, não no aplicativo Node JS Server local.

## 1. Preparar o GitHub
1. Entre em https://github.com/ e crie um repositório privado chamado `arvion-lab-reels`.
2. Não marque para adicionar README, licença ou `.gitignore` (o projeto já tem arquivos próprios).
3. Copie a URL HTTPS do repositório.

## 2. Enviar os arquivos pelo Termux
Instale o Termux preferencialmente pelo F-Droid: https://f-droid.org/packages/com.termux/

No Termux, execute:

```bash
pkg update -y && pkg install git gh unzip -y
termux-setup-storage
```

Autorize o acesso aos arquivos quando o Android perguntar. Coloque o ZIP extraído na pasta Downloads. Depois:

```bash
cd ~/storage/downloads
unzip arvion-lab-reel-ia-android.zip
cd arvion-ia-reel
```

Autentique o GitHub pelo navegador:

```bash
gh auth login
```

Escolha GitHub.com, HTTPS e autenticação pelo navegador. Em seguida:

```bash
gh auth setup-git
git init
git add .
git commit -m "Adiciona projeto Arvion Lab Reel IA"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/arvion-lab-reels.git
git push -u origin main
```

Troque `SEU_USUARIO` pelo seu nome de usuário do GitHub. Se o repositório já tiver arquivos ou commits, pare e faça a integração antes de enviar; não use `--force`.

## 3. Iniciar a renderização
1. Abra o repositório no GitHub pelo navegador.
2. Entre na aba **Actions**.
3. Se necessário, confirme **I understand my workflows, go ahead and enable them**.
4. Selecione **Render Arvion Reel**.
5. Toque em **Run workflow**.
6. Mantenha a voz padrão `pt-BR-AntonioNeural` e confirme.

O workflow instala Node e Python no Linux, instala as dependências, gera a narração com Edge TTS e executa `npm run render`.

## 4. Baixar o MP4
1. Aguarde a execução ficar verde com status **Success**.
2. Abra a execução concluída.
3. Na seção **Artifacts**, toque em `arvion-lab-reel`.
4. Baixe o ZIP do artefato e extraia `arvion-reel-ia.mp4` no Android.

O artefato fica disponível por 14 dias. Cada execução produz um novo artefato.

## 5. Criar novos Reels
- Edite `src/script.json` para alterar o roteiro e os tempos.
- Edite `src/scenes.tsx` para mudar as cenas animadas.
- Edite `src/config.ts` para identidade visual e caminhos de clipes.
- Envie as alterações com `git add .`, `git commit -m "Atualiza reel"` e `git push`.
- Execute novamente **Render Arvion Reel** em Actions.

## Limitações importantes
- O workflow gera a narração, mas precisa de internet no runner para o Edge TTS.
- As cenas atuais são animações programadas. Clipes de vídeo realistas gerados por IA ainda precisam ser criados e adicionados em `public/clips/`, conforme `docs/PROMPTS.md` (se disponível), e configurados em `src/config.ts`.
- O aplicativo Android **Node JS Server** do print é um servidor local de demonstração. Ele não executa automaticamente o Remotion nem substitui o GitHub Actions.
- Não compartilhe tokens de autenticação ou senhas em prints, mensagens ou no repositório.
