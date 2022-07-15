# Power BI Rest API coverage

_Last update: July 19, 2022_

| API                                                  | PBI CLI Command       | PBICLI Version |
| ---------------------------------------------------- | --------------------- | -------------- |
| Add Power BI Encryption Key                          | key add               | v1.1           |
| Apps GetAppsAsAdmin                                  | app list              | v1.2           |
| Apps GetAppUsersAsAdmin                              | app list-user         | v1.2           |
| Capacities AssignWorkspacesToCapacity                | capacity assign       | v1.1           |
| Capacities GetCapacityUsersAsAdmin                   | capacity list-user    | v1.2           |
| Capacities UnassignWorkspacesFromCapacity            | capacity unassign     | v1.1           |
| Dashboards GetDashboardsAsAdmin                      | dashboard list        | v1.1           |
| Dashboards GetDashboardsInGroupAsAdmin               | dashboard list        | v1.1           |
| Dashboards GetDashboardSubscriptionsAsAdmin          | -                     | -              |
| Dashboards GetDashboardUsersAsAdmin                  | dashboard list-user   | v1.2           |
| Dashboards GetTilesAsAdmin                           | dashboard tile        | v1.1           |
| Dataflows ExportDataflowAsAdmin                      | dataflow export       | v1.1           |
| Dataflows GetDataflowDatasourcesAsAdmin              | dataflow datasource   | v1.1           |
| Dataflows GetDataflowUsersAsAdmin                    | dataflow list-user    | v1.2           |
| Dataflows GetDataflowsAsAdmin                        | dataflow list         | v1.1           |
| Dataflows GetDataflowsInGroupAsAdmin                 | dataflow list         | v1.1           |
| Dataflows GetUpstreamDataflowsInGroupAsAdmin         | dataflow upstream     | v1.1           |
| Datasets GetDatasetToDataflowsLinksInGroupAsAdmin    | dataset dataflow      | v1.1           |
| Datasets GetDatasetUsersAsAdmin                      | dataset list-user     | v1.2           |
| Datasets GetDatasetsAsAdmin                          | dataset list          | v1.1           |
| Datasets GetDatasetsInGroupAsAdmin                   | dataset list          | v1.1           |
| Datasets GetDatasourcesAsAdmin                       | dataset datasource    | v1.1           |
| Get Activity Events                                  | activity              | v1.1           |
| Get Capacities As Admin                              | capacity list         | v1.1           |
| Get Power BI Encryption Keys                         | key list              | v1.1           |
| Get Refreshable For Capacity                         | refresh               | v1.1           |
| Get Refreshables                                     | refresh               | v1.1           |
| Get Refreshables For Capacity                        | refresh               | v1.1           |
| Groups AddUserAsAdmin                                | workspace add-user    | v1.1           |
| Groups DeleteUserAsAdmin                             | workspace delete-user | v1.1           |
| Groups GetGroupAsAdmin                               | workspace list        | v1.1           |
| Groups GetGroupsAsAdmin                              | workspace list        | v1.1           |
| Groups GetGroupUsersAsAdmin                          | workspace list-user   | v1.2           |
| Groups GetUnusedArtifactsAsAdmin                     | workspace unused      | v1.2           |
| Groups RestoreDeletedGroupAsAdmin                    | workspace restore     | v1.1           |
| Groups UpdateGroupAsAdmin                            | workspace update-user | v1.1           |
| Imports GetImportsAsAdmin                            | import                | v1.1           |
| InformationProtection RemoveLabelsAsAdmin            | label remove          | v1.2           |
| InformationProtection SetLabelsAsAdmin               | label set             | v1.2           |
| Patch Capacity As Admin                              | capacity update       | v1.1           |
| Pipelines DeleteUserAsAdmin                          | pipeline delete-user  | v1.2           |
| Pipelines GetPipelinesAsAdmin                        | pipeline list         | v1.2           |
| Pipelines GetPipelineUsersAsAdmin                    | pipeline list-user    | v1.2           |
| Pipelines UpdateUserAsAdmin                          | pipeline update-user  | v1.2           |
| Reports GetReportSubscriptionsAsAdmin                | report subscription   | v1.2           |
| Reports GetReportUsersAsAdmin                        | report list-user      | v1.2           |
| Reports GetReportsAsAdmin                            | report list           | v1.1           |
| Reports GetReportsInGroupAsAdmin                     | report list           | v1.1           |
| Rotate Power BI Encryption Key                       | key rotate            | v1.1           |
| Users GetUserArtifactAccessAsAdmin                   | user artifact         | v1.2           |
| Users GetUserSubscriptionsAsAdmin                    | user subscription     | v1.2           |
| WidelySharedArtifacts LinksSharedToWholeOrganization | -                     | -              |
| WidelySharedArtifacts PublishedToWeb                 | -                     | -              |
| WorkspaceInfo GetModifiedWorkspaces                  | workspace modified    | v1.2           |
| WorkspaceInfo GetScanResult                          | workspace result      | v1.2           |
| WorkspaceInfo GetScanStatus                          | workspace status      | v1.2           |
| WorkspaceInfo PostWorkspaceInfo                      | workspace scan        | v1.2           |
