
# Crono$ServerProperties

Devuelve las propiedades del servidor de base de datos.

```
SELECT *
FROM Crono$ServerProperties
```

La consulta devuelve estas columnas:

- PropertyName
- Value

Las propiedades de servidor informadas pueden variar en función del servidor. Algunas propiedades comunes son:

- BuildClrVersion
- Collation
- CollationID
- ComparisonStyle
- ComputerNamePhysicalNetBIOS
- Edition
- EditionID
- EngineEdition
- FilestreamConfiguredLevel
- FilestreamEffectiveLevel
- FilestreamShareName
- HadrManagerStatus
- InstanceDefaultBackupPath
- InstanceDefaultDataPath
- InstanceDefaultLogPath
- InstanceName
- IsAdvancedAnalyticsInstalled
- IsBigDataCluster
- IsClustered
- IsExternalAuthenticationOnly
- IsExternalGovernanceEnabled
- IsFullTextInstalled
- IsHadrEnabled
- IsIntegratedSecurityOnly
- IsLocalDB
- IsPolyBaseInstalled
- IsServerSuspendedForSnapshotBackup
- IsSingleUser
- IsTempDbMetadataMemoryOptimized
- IsXTPSupported
- LCID
- LicenseType
- MachineName
- NumLicenses
- PathSeparator
- ProcessID
- ProductBuild
- ProductBuildType
- ProductLevel
- ProductMajorVersion
- ProductMinorVersion
- ProductUpdateLevel
- ProductUpdateReference
- ProductUpdateType
- ProductVersion
- ResourceLastUpdateDateTime
- ResourceVersion
- ServerName
- SqlCharSet
- SqlCharSetName
- SqlSortOrder
- SqlSortOrderName
- SuspendedDatabaseCount

