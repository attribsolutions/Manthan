pipeline {
    agent any

    environment {
        IMAGE_NAME = "fooderpfrontend"
        IMAGE_TAG = "latest"
        DOCKER_USERNAME = 'adarshmali'
        DOCKER_PASSWORD = 'Adm@514040'
        DOCKER_HUB_USER = "adarshmali"
        REGISTRY = "${DOCKER_HUB_USER}/${IMAGE_NAME}"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ./frontend1'
            }
        }

        stage('Login to Docker') {
            steps {
                script {
                    sh """
                    echo '${DOCKER_PASSWORD}' | docker login -u '${DOCKER_USERNAME}' --password-stdin
                    """
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY}:${IMAGE_TAG}'
                sh 'docker push ${REGISTRY}:${IMAGE_TAG}'
            }
        }

        stage('Deploy on EC2') {
            steps {
                sh """
                    docker stop frontend-container || true
                    docker rm frontend-container || true
                    docker pull ${REGISTRY}:${IMAGE_TAG}
                    docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true
                    docker run -d -p 3000:3000 --name frontend-container ${REGISTRY}:${IMAGE_TAG}
                    
                """
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}