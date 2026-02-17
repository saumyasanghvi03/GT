param location string = resourceGroup().location
param environmentName string = 'pramana-env'
param appName string = 'pramana-terminal'

resource containerEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: environmentName
  location: location
}

resource app 'Microsoft.App/containerApps@2023-05-01' = {
  name: appName
  location: location
  properties: {
    managedEnvironmentId: containerEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 4000
      }
    }
    template: {
      containers: [
        {
          name: 'api'
          image: 'yourregistry.azurecr.io/pramana-api:latest'
          resources: {
            cpu: json('1.0')
            memory: '2Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 5
      }
    }
  }
}
