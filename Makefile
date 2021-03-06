.PHONY: deploy clean

init: 
	git checkout master

deploy: 
	cd dist && \
	git add --all && \
	git commit -m "Deploy to gh-pages11" && \
	git push origin gh-pages

# Removing the actual dist directory confuses git and will require a git worktree prune to fix
clean:
	rm -rf dist/*
  
dev:
	git add --all && \
	git commit -m "Dev commit" && \
	git push origin master
# sudo rm -rf _site
# echo "_site/" >> .gitignore
# git branch --orphan gh-pages

# sudo bundle exec jekyll build
# git worktree add dist gh-pages
