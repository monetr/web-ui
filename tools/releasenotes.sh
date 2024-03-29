#!/bin/bash

releaseTag=$1

gpgBadge() {
    commitSha=$1
    gpgVerified=$(git --no-pager show -s --pretty=tformat:"%G?" $gitCommit)
    if [ $gpgVerified = "G" ]
    then
        echo "[![Verified](https://badgen.net/badge/GPG/Verified/green?scale=0.9)]()"
    elif [ $gpgVerified = "N" ]
    then
        echo "[![No GPG](https://badgen.net/badge/GPG/Not%2Verified/red)]()"
    else
        signature=$(git --no-pager show -s --pretty=tformat:"%GK" $gitCommit)
        echo "[![Not Verified](https://badgen.net/badge/GPG/Not%20Verified%20$1/red)]()"
    fi
}

git_commits=$(git --no-pager log $(git describe --tags --abbrev=0)..HEAD --no-merges --pretty=format:"%H");
commitCount=$(echo "$git_commits" | wc -l | xargs);
if [ "$commitCount" == "0" ]
then
  exit 1;
fi

echo "# Today's Release: **$releaseTag**"
echo "This release is autogenerated."
echo "## Previous Release: **$(git describe --tags --abbrev=0)**";
echo "## Number Of Commits Since Last Release: $commitCount";
for gitCommit in $git_commits
do
    commitSha=$gitCommit
    authorName=$(git --no-pager show -s --pretty=tformat:"%aN" $gitCommit)
    commitMessage=$(git --no-pager show -s --pretty=tformat:"%s" $gitCommit)
    commitBody=$(git --no-pager show -s --pretty=tformat:"%b" $gitCommit | tr '\n' ' ' | xargs)
    gpgVerified=$(git --no-pager show -s --pretty=tformat:"%G?" $gitCommit)
    badge=$(gpgBadge $commitSha)
    echo "- $commitSha **$authorName** - _${commitMessage}_"
    if [ ! -z "$commitBody" ]
    then
      echo "  > $commitBody"
    fi
done
