#!/usr/bin/env bash
# Pipeline de vídeo (Git Bash + ffmpeg). Lê os brutos fora do repo e grava em public/media/video.
# Uso: bash scripts/media/build-videos.sh [hero-mobile|hero-desktop|reels|loops|sobre|stills|all]
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
SITE="$(cd "$HERE/../.." && pwd)"
RAW="$(cd "$SITE/.." && pwd)"
OUT="$SITE/public/media/video"
TMP="$HERE/_out/video"
STILLS="$HERE/_out/stills"
mkdir -p "$OUT" "$TMP" "$STILLS"

FABRICA="$RAW/Video Heroe/04_Finger 2024 - Fábrica.mp4"
INSTA="$(ls "$RAW/Video Heroe/"SnapInsta*.mp4)"
NEST="$RAW/Empreendimentos Feitos/Nest 23-20260918T153900Z-1-001/Nest 23/Takes/Takes Multi Shot"
LODGE="$RAW/Empreendimentos Feitos/Lodge Vaca Brava-20260918T153840Z-1-001/Lodge Vaca Brava"
GOURMET="$RAW/Empreendimentos Feitos/4 - Sousa Andrade T3-20260918T161544Z-1-001/4 - Sousa Andrade T3/2J4A7844-HDR.jpg"

FF="ffmpeg -hide_banner -loglevel error -y"
# O vídeo da fábrica traz o logo antigo como marca d'água em ~92% da altura: o crop 1080x1720 remove.
CROP_FAB="crop=1080:1720:0:0"

h264() { # h264 <entrada> <saida> <crf> <maxrate_k> [filtro]
  $FF -i "$1" ${5:+-vf "$5"} -an -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow \
    -crf "$3" -maxrate "${4}k" -bufsize "$(( $4 * 2 ))k" -movflags +faststart "$2"
}
# Só H.264: nos testes o AV1 (SVT, crf 36-38) saiu do mesmo tamanho ou maior que o H.264 nestes
# clipes curtos, e em celulares modestos é decodificado por software.

hero_mobile() {
  # drone -> CNC -> mão conferindo a peça -> ambiente montado. Loop sem emenda: o último xfade
  # volta para o início do plano de drone (6.0-6.5) e o vídeo começa em 6.5.
  local F="$CROP_FAB,fps=30,format=yuv420p,setsar=1"
  $FF -i "$FABRICA" -filter_complex "
    [0:v]trim=6.5:8.7,setpts=PTS-STARTPTS,$F[a];
    [0:v]trim=40.5:43.5,setpts=PTS-STARTPTS,$F[b];
    [0:v]trim=63.2:66.0,setpts=PTS-STARTPTS,$F[c];
    [0:v]trim=94.6:98.6,setpts=PTS-STARTPTS,$F[d];
    [0:v]trim=6.0:6.5,setpts=PTS-STARTPTS,$F[e];
    [a][b]xfade=fade:duration=0.5:offset=1.7[ab];
    [ab][c]xfade=fade:duration=0.5:offset=4.2[abc];
    [abc][d]xfade=fade:duration=0.5:offset=6.5[abcd];
    [abcd][e]xfade=fade:duration=0.5:offset=10.0[v]" \
    -map "[v]" -an -c:v libx264 -preset medium -crf 12 "$TMP/hero-mobile-master.mp4"
  $FF -i "$TMP/hero-mobile-master.mp4" -frames:v 1 "$STILLS/hero-mobile-poster.png"
  h264 "$TMP/hero-mobile-master.mp4" "$OUT/hero-mobile.mp4" 28 1600 "scale=720:-2"
}

hero_desktop() {
  # Abre com movimento lento sobre a foto real da área gourmet (o pôster/LCP é o 1º quadro),
  # depois os três clipes do Nest 23, com as pontas cortadas.
  $FF -loop 1 -framerate 24 -t 4.8 -i "$GOURMET" -vf "
    crop=iw:iw*9/16:0:ih*0.10,scale=3840:2160,
    zoompan=z='1+0.05*on/115':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=24,
    format=yuv420p" -c:v libx264 -preset medium -crf 12 "$TMP/kb-gourmet.mp4"
  local F="fps=24,scale=1920:1080,format=yuv420p,setsar=1"
  $FF -i "$TMP/kb-gourmet.mp4" -i "$NEST/4fee4a9c-1afc-4d56-90cb-e41618ea1e13.mp4" \
      -i "$NEST/b15efa18-986f-4b68-9df9-e85677e8665b.mp4" -i "$NEST/86415d28-20a9-4698-9ffc-ba854d911e78.mp4" \
    -filter_complex "
    [0:v]trim=0.8:4.8,setpts=PTS-STARTPTS,$F[a];
    [1:v]trim=0.5:4.5,setpts=PTS-STARTPTS,$F[b];
    [2:v]trim=0.5:4.5,setpts=PTS-STARTPTS,$F[c];
    [3:v]trim=0.3:3.8,setpts=PTS-STARTPTS,$F[d];
    [0:v]trim=0:0.8,setpts=PTS-STARTPTS,$F[e];
    [a][b]xfade=fade:duration=0.8:offset=3.2[ab];
    [ab][c]xfade=fade:duration=0.8:offset=6.4[abc];
    [abc][d]xfade=fade:duration=0.8:offset=9.6[abcd];
    [abcd][e]xfade=fade:duration=0.8:offset=12.3[v]" \
    -map "[v]" -an -c:v libx264 -preset medium -crf 12 "$TMP/hero-desktop-master.mp4"
  $FF -i "$TMP/hero-desktop-master.mp4" -frames:v 1 "$STILLS/hero-desktop-poster.png"
  h264 "$TMP/hero-desktop-master.mp4" "$OUT/hero-desktop.mp4" 26 1700 "scale=1600:900"
}

reels() {
  # Decorados do Lodge Vaca Brava. Os últimos ~6 s de cada arquivo são o cartão de logo: ficam fora.
  local i=0
  for name in "Decorado 1 - Parte 1" "Decorado 1 - Parte 2" "Decorado 2 - Parte 1" "Decorado 2 - Parte 2" "Decorado 2 - Parte 3"; do
    i=$((i+1))
    local F="trim=0.5:9.5,setpts=PTS-STARTPTS,fps=30,scale=720:-2,format=yuv420p"
    h264 "$LODGE/$name.mp4" "$OUT/reel-lodge-$i.mp4" 28 1100 "$F"
    $FF -ss 0.5 -i "$LODGE/$name.mp4" -frames:v 1 "$STILLS/reel-lodge-$i.png"
  done
}

loop_seamless() { # loop_seamless <inicio> <duracao> <nome>  (xfade de 0.5 s do fim para o começo)
  local s="$1" d="$2" x=0.5
  calc() { awk "BEGIN { printf \"%.3f\", $1 }"; } # Git Bash não traz bc
  local F="$CROP_FAB,crop=1080:1350:0:185,fps=30,scale=540:-2,format=yuv420p,setsar=1"
  $FF -i "$FABRICA" -filter_complex "
    [0:v]trim=$(calc "$s+$x"):$(calc "$s+$d"),setpts=PTS-STARTPTS,$F[m];
    [0:v]trim=$s:$(calc "$s+$x"),setpts=PTS-STARTPTS,$F[e];
    [m][e]xfade=fade:duration=$x:offset=$(calc "$d-2*$x")[v]" \
    -map "[v]" -an -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow -crf 29 -maxrate 900k -bufsize 1800k \
    -movflags +faststart "$OUT/$3.mp4"
}
loops() {
  loop_seamless 40.5 4.5 loop-fabrica-cnc
  loop_seamless 63.2 2.8 loop-fabrica-mao
}

sobre() {
  # Institucional com fala: mantém o áudio, corta o cartão do logo antigo no final.
  $FF -i "$INSTA" -t 95 -vf "scale=1280:720,fade=t=out:st=94.4:d=0.6,format=yuv420p" -af "afade=t=out:st=94.4:d=0.6" \
    -c:v libx264 -profile:v high -preset slow -crf 28 -maxrate 1000k -bufsize 2000k \
    -c:a aac -b:a 96k -movflags +faststart "$OUT/finger-institucional.mp4"
  $FF -ss 27 -i "$INSTA" -frames:v 1 "$STILLS/institucional-poster.png"
}

stills() {
  still() { $FF -ss "$1" -i "$FABRICA" -frames:v 1 -vf "$CROP_FAB" "$STILLS/fabrica-$2.png"; }
  still 7.3 drone; still 44 cnc; still 64.5 mao; still 69.2 mdf; still 75 palhinha; still 96.5 showroom
}

case "${1:-all}" in
  hero-mobile) hero_mobile ;; hero-desktop) hero_desktop ;; reels) reels ;;
  loops) loops ;; sobre) sobre ;; stills) stills ;;
  all) stills; hero_mobile; hero_desktop; reels; loops; sobre ;;
  *) echo "alvo desconhecido: $1" >&2; exit 1 ;;
esac

echo; ls -la "$OUT" | awk 'NR>1 {printf "%8.0f KB  %s\n", $5/1024, $NF}'
