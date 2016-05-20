#!/usr/bin/env  bash
# ----------------------------------------------------------------------
#
# Merge Dictionnaries
#
# ISTEX-DATA
#
# ----------------------------------------------------------------------

DIC_ONE="$1"
DIC_TWO="$2"
DIC_FINAL="$3"
TEMPDIR="/dev/shm"
TEMPFILE="$RANDOM"

if [ -z "$DIC_FINAL" ]; then
  echo "Argument(s) manquant"
  echo "mergedic : fusionne et ordonne deux listes de mots en supprimant les doublons"
  echo "Usage : ./mergedic dico1 dico2 dico_final"
  exit 1
fi

if [ ! -f $DIC_ONE ]; then
  echo "Le document \"$DIC_ONE\" n'existe pas"
  exit 1
fi

if [ ! -f $DIC_TWO ]; then
  echo "Le document \"$DIC_TWO\" n'existe pas"
  exit 1
fi

sort -u -i "$DIC_ONE" "$DIC_TWO" > "$DIC_FINAL"

exit 0
