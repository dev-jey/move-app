#!/usr/bin/env bash

# Exit immediately if a command exits with an non-zero status
set -e

# Clone the deployment repository using an sshkey added to the repository
clone_deployment_repo(){
  # Disable strict host key checking
  mkdir ~/.ssh/ && echo "Host github.com\n\tStrictHostKeyChecking no\n" > ~/.ssh/config
  echo $SSH_PRIVATE_KEY | base64 --decode >> ~/.ssh/id_rsa
  sudo chmod 400 ~/.ssh/id_rsa

  # Clone the the specific branch for the current node environment
  if [ "${GIT_BRANCH}" = "master" ]; then
    export NAMESPACE="production"
    git clone -b master ${DEPLOYMENT_SCRIPTS_REPO} -vvv
  elif [ "${GIT_BRANCH}" = "develop" ]; then
    export NAMESPACE="staging"
    git clone -b develop ${DEPLOYMENT_SCRIPTS_REPO} -vvv
  fi

  export NODE_ENV=${NAMESPACE}
}


# Export environment variables
export_env(){
  export PROJECT_NAME=${PROJECT_NAME}
  export COMPUTE_ZONE=${COMPUTE_ZONE}
  export PROD_CLUSTER_NAME=${PROD_CLUSTER_NAME}
  export GCP_PROJECT_ID=${GCP_PROJECT_ID}
  export STAGING_CLUSTER_NAME=${STAGING_CLUSTER_NAME}
  export TEMBEA_DOMAIN=${TEMBEA_DOMAIN}
  export TEMBEA_FRONTEND_DOMAIN=${TEMBEA_FRONTEND_DOMAIN}
  export IMG_TAG=$(echo $GIT_COMMIT | cut -c -7)
}

# Install gettext to enable environment variable substitution in the deployment yaml files
install_gettext(){
  apt-get install gettext -y
}

# Substitute the variables with the values of their corresponding environment variables
substitute_env(){
  cd tembea-deployment-scripts/ansible/jenkins-frontend
  envsubst < ./roles/deployment/templates/tembea-frontend-deployment.yml > tembea-frontend-deployment.yml
  envsubst < ./roles/service/templates/tembea-frontend-service.yml > tembea-frontend-service.yml
}

deploy(){
  bash deploy.sh
}

main(){
  clone_deployment_repo
  export_env
  install_gettext
  substitute_env
  deploy
}

main

$@
