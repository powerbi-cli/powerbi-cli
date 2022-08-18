# Power BI Rest API coverage

_Last update: August 16, 2022_

## Scorecard

| API                        | PBI CLI Command | PBICLI Version |
| -------------------------- | --------------- | -------------- |
| Delete By ID               | delete          | v1.2           |
| Get                        | show            | v1.2           |
| Get By ID                  | list            | v1.2           |
| Get Scorecard By Report Id | show            | v1.3           |
| Move Goals                 | move            | v1.3           |
| Patch By ID                | update          | v1.3           |
| Post                       | create          | v1.2           |

## Goals

| API                                  | PBI CLI Command | PBICLI Version |
| ------------------------------------ | --------------- | -------------- |
| Delete By ID                         | goal delete     | v1.3           |
| Delete Goal Current Value Connection | goal disconnect | v1.3           |
| Delete Goal Target Value Connection  | goal disconnect | v1.3           |
| Get                                  | goal show       | v1.2           |
| Get By ID                            | goal list       | v1.2           |
| Get Refresh History                  | goal history    | v1.3           |
| Patch By ID                          | goal update     | v1.3           |
| Post                                 | goal create     | v1.2           |
| Refresh Goal Current Value           | goal refresh    | v1.3           |
| Refresh Goal Target Value            | goal refresh    | v1.3           |

## Goal status rules

| API    | PBI CLI Command  | PBICLI Version |
| ------ | ---------------- | -------------- |
| Delete | goal rule delete | v1.3           |
| Get    | goal rule show   | v1.3           |
| Post   | goal rule create | v1.3           |

## Goal values

| API          | PBI CLI Command   | PBICLI Version |
| ------------ | ----------------- | -------------- |
| Delete By ID | goal value delete | v1.3           |
| Get          | goal value list   | v1.3           |
| Get By ID    | goal value show   | v1.3           |
| Patch By ID  | goal value update | v1.3           |
| Post         | goal value create | v1.3           |

## Goal notes

| API          | PBI CLI Command        | PBICLI Version |
| ------------ | ---------------------- | -------------- |
| Delete By ID | goal value note delete | v1.3           |
| Patch By ID  | goal value note update | v1.3           |
| Post         | goal value note create | v1.3           |
