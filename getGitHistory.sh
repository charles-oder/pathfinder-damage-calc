#!/bin/bash
tags=$(git tag | grep v | tac | head -10 | tail -9)
prevLine=$(git tag | grep v | tac | head -1)
mkdir -p "./src/about"
fileName="./src/about/AboutHistory.ts"
echo "/* eslint prettier/prettier: \"off\" */" > $fileName
echo "export default class AboutHistory {" >> $fileName
echo "  public static history = [" >> $fileName
while IFS= read -r line; do
  if [[ $prevLine == $line ]]; then
    continue
  fi
  echo "    {" >> $fileName
  echo "      version: \"$prevLine\"," >> $fileName
  echo "      commits: [" >> $fileName
  commits=$(git log $line..$prevLine --pretty=format:%s --abbrev-commit | sed "s/\"/'/g")
  while IFS= read -r commit; do
    echo "        \"$commit\"," >> $fileName
  done <<< "$commits"
  echo "      ]" >> $fileName
  echo "    }," >> $fileName
  prevLine=$line
done <<< "$tags"
echo "  ];" >> $fileName
echo "}" >> $fileName
