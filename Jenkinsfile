#!groovyâ€‹

pipeline {
    agent { label 'nodejs-slave' }
    environment {
        DOCKER_INT_PORT = "8080"
        DOCKER_EXT_PORT = "35003"
        DOCKER_IMG_NAME = "bolieplate-react-ci"
        DOCKER_CTN_NAME = "BOILERPLATE-REACT"
    }
    stages {
        stage('Build') {
            steps {
                script{
                    docker.withRegistry('http://wegregistry:5000') {
                        def app = docker.build("${DOCKER_IMG_NAME}:${env.BUILD_ID}")
                        app.push('latest')
                    }
                }
            }
        }

        stage('Run QA Container') {
            steps {
                script {
                    docker.withServer('tcp://10.0.12.44:2376', 'docker-hub-qa') {
                        sh 'docker pull wegregistry:5000/${DOCKER_IMG_NAME}'
                        sh 'if [ `docker ps -a | grep ${DOCKER_CTN_NAME} |wc -l` -eq "1" ]  ; then docker rm -f ${DOCKER_CTN_NAME}; fi'
                        sh 'docker run -d -p ${DOCKER_EXT_PORT}:${DOCKER_INT_PORT} -e ENVIRONMENT=QA --name="${DOCKER_CTN_NAME}" --restart=on-failure:2 wegregistry:5000/${DOCKER_IMG_NAME}:latest'
                    }
                }
            }
        }

        stage('Run PRD Container') {
            steps {
                script{
                    def user
                    def userInput = true
                    def didTimeout = false

                    try {
                        timeout(time: 30, unit: 'MINUTES') {
                            input "Deploy to Production?"
                        }
                    } catch (err) {
                        user = err.getCauses()[0].getUser()
                        userInput = false

                        if('SYSTEM' == user.toString()) { // SYSTEM means timeout.
                            didTimeout = true
                        } else {
                            echo "Aborted by: [${user}]"
                            currentBuild.result = 'ABORTED'
                        }
                    }

                    if (didTimeout) {
                        echo "No input was received before timeout."
                    } else if (userInput == true) {
                        docker.withServer('tcp://10.0.36.129:2376', 'docker-hub-prd') {
                            sh 'docker pull wegregistry:5000/${DOCKER_IMG_NAME}'
                            sh 'if [ `docker ps -a | grep ${DOCKER_CTN_NAME} |wc -l` -eq "1" ]  ; then docker rm -f ${DOCKER_CTN_NAME}; fi'
                            sh 'docker run -d -p ${DOCKER_EXT_PORT}:${DOCKER_INT_PORT} -e ENVIRONMENT=PRD --name="${DOCKER_CTN_NAME}" --restart=on-failure:2 wegregistry:5000/${DOCKER_IMG_NAME}:latest'
                        }
                    }
                }
            }
        }
    }
}
