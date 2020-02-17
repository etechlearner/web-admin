pipeline {
    environment {
        registryCredential = 'DockerHub'
        PROJECT_ID = 'dev-gymrabbit'
        ZONE = 'us-central1-a'
        CLUSTER_NAME = 'gke-dev'
        DEPLOYMENT_NAME ='admin-web'
        SERVICE_NAME ='admin-web'
        IMAGE_NAME = 'admin-web'
        REGISTRY = "gymrabbit"
        REGISTRY_WITH_IMAGE = "$REGISTRY/$IMAGE_NAME"
        IMAGE_VERSION = getShortCommitHash()
        // IMAGE_VERSION = '2'
    }
    agent any
    stages {
        stage('GIT ClONING') {
            steps {
                git 'git@gitlab.com:appiskeydev/angularjs/gymrabbit/admin-web.git'
                sh 'git fetch --all'
                sh 'git checkout dev'
                sh 'git reset --hard origin/dev' 
            }
        }
        stage('INSTALL PACKAGES') {
            steps {
                sh "rm -rf node_modules"
                sh "rm -rf package-lock.json"
                sh "npm install"
            }
        }
        stage('SETUP ENVIROMENT') {
            steps {
                sh "sed -i -e 's/jenkinsBuildNO/${env.IMAGE_VERSION}/g' src/environments/environment.prod.ts"
            }
        }        
        stage('BUILD ARTIFACT') {
            steps {
                sh 'rm -rf dist'
                sh "node --max_old_space_size=6144 ./node_modules/@angular/cli/bin/ng build --prod --base-href /admin-web/  --stats-json --source-map=false "
            }
        }
        stage('BUILDING DOCKER IMAGE') {
            steps {
                script {
                    sh("docker build -t $REGISTRY_WITH_IMAGE:$IMAGE_VERSION .")
                }
            }
        }
        stage('DEPLOY DOCKER IMAGE') {
            steps {
                script {
                    docker.withRegistry('', registryCredential) {
                        sh("docker push $REGISTRY_WITH_IMAGE:$IMAGE_VERSION")
                    }
                }
            }
        }
        stage('REMOVE USUSED DOCKER IMAGE') {
            steps {
                sh "docker rmi $REGISTRY_WITH_IMAGE:$IMAGE_VERSION"
            }
        }
        stage('DEPLOY ON DEV SERVER') {
            steps {
                withCredentials([file(credentialsId: 'GC_KEY', variable: 'GC_KEY')]) {
                    sh("gcloud auth activate-service-account --key-file=${GC_KEY}")
                    sh("gcloud container clusters get-credentials $CLUSTER_NAME --zone $ZONE --project $PROJECT_ID")
                    sh("cat .docs/deployment.yaml | sed -e 's/KVERSION/${env.IMAGE_VERSION}/g' -e 's/KAPP_NAME/$IMAGE_NAME/g' -e 's/KIMAGE/$IMAGE_NAME/g' -e 's/KREGISTRY/$REGISTRY/g' | kubectl apply -f-")
                }
            }
        }
    }
}

def getShortCommitHash() {
    commitNumber = '1'
        try {
    commitNumber = 'd' + sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()            
        } catch (err) {
            echo err.getMessage()
            echo "Error detected, but we will continue."
        }
        return commitNumber;

}