# ARVION LAB — Reel IA

Projeto em React + Remotion para produzir Reels verticais da Arvion Lab. Inclui 7 cenas animadas por código, legendas, trilha, efeitos sonoros, roteiro e geração de narração pt-BR.

## Produção pelo Android
A forma recomendada é usar o Android para controlar o GitHub e executar a renderização no GitHub Actions (Linux na nuvem). Consulte **[docs/GUIA_ANDROID.md](docs/GUIA_ANDROID.md)**.

Depois de enviar o projeto ao repositório GitHub:
1. Abra **Actions**.
2. Escolha **Render Arvion Reel**.
3. Toque em **Run workflow**.
4. Aguarde a execução terminar e baixe o artefato `arvion-lab-reel`.

O artefato contém `arvion-reel-ia.mp4` e, se gerada, `capa.png`.

## Produção local (computador)
Requisitos: Node.js 20 recomendado, Python 3.9+ e internet para Edge TTS.

```bash
npm install
python -m pip install edge-tts
python scripts/gerar_narracao.py
npm run dev
npm run render
```

## Estrutura principal
- `src/script.json`: texto e tempos do roteiro; palavras entre `*` recebem destaque.
- `src/scenes.tsx`: sete cenas animadas.
- `src/Video.tsx`: composição, linha do tempo, áudio e efeitos.
- `src/Captions.tsx`: legendas sincronizadas.
- `src/config.ts`: identidade visual e caminhos de clipes externos.
- `src/flags.json`: ativa/desativa áudio.
- `scripts/gerar_narracao.py`: gera arquivos MP3 com Edge TTS.
- `public/audio/`: trilha e efeitos incluídos no projeto.
- `.github/workflows/render-reel.yml`: automação de renderização na nuvem.

## Clipes cinematográficos externos (opcional)
As cenas animadas em código funcionam sem clipes adicionais. Para inserir vídeos 3D realistas, gere um clipe por cena em formato vertical 9:16, coloque em `public/clips/` e configure os caminhos correspondentes em `src/config.ts`.

## Observações
- A primeira renderização pode demorar, pois o GitHub instala as dependências e gera a narração.
- A narração é gerada via Edge TTS e requer acesso à internet.
- O projeto não inclui credenciais. Nunca envie tokens ou senhas para o repositório.
- O Node JS Server mostrado nas capturas Android é um servidor local de demonstração, não o ambiente de renderização Remotion.
