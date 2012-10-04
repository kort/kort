# script from https://gist.github.com/443c00fe346045522db7
File.open(".git/config", "a") do |f|
  f.puts <<-EOF
[remote "heroku"]
    url = url = git@heroku.com:kort.git
    fetch = +refs/heads/*:refs/remotes/heroku/*
EOF
end

git_config = File.expand_path("~/.gitconfig")
File.open(git_config, "w") do |f|
  f.puts <<-EOF
[user]
    name = Travis
    email = build@travis-ci.org
EOF
end


known_hosts = File.expand_path("~/.ssh/config")
File.open(known_hosts, "a") do |f|
  f.puts <<-EOF
Host heroku.com
   StrictHostKeyChecking no
   CheckHostIP no
   UserKnownHostsFile=/dev/null
EOF
end
