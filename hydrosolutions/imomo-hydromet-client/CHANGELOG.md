## v0.14.1

- Fix a bug with empty properties on the Site model.

## v0.14.0

- Implement a prototype of the forecasting interface, requires v0.14.0 of the server.

## v0.13.0

- 0a9a9fe: Allow the re-upload and download of historic discharge data. Requires server v0.13.x.

## v0.12.1

- 780a04f: Attempt to fix issue with upload of discharge norm. Remove MIME check.

## v0.12.0

- 8e7b452: Improve bulletin generation to use S3. Breaks compatibility with the 0.11.x releases of the server.

## v0.11.2

- 629c642656: Point to the new backend endpoint.

## v0.11.1

- a3c23fe: Fix issue with missing template file on AWS due to type on copy task configuration.

## v0.11.0 

- 6c53efdacd1ee5cd4f725255e02a8da2c50b35ad: Add functionality to view and edit the maximum safe discharge for site from the overview page. Requires a v0.11.0 server.

## v0.10.0

- 652fb3a: Enable the download of the journal file sent from the server, change the view model adapter to make it compatible with the v0.10.0 server. This makes the client incompatible with v0.9.x server versions.

## v0.9.2

- Fix bug in the copy task in the build.

## v0.9.1

- Remove obsolete "go to edit" button in dialog when a new station is created. Fixes #35 - ea2bcfda5a6960c80a67562164cd1d69baf75fcc
- Add option to download excel template in the norm upload dialog. Fixes #38 - b663384197d8d59a2629886e50746dbbb01acc34
