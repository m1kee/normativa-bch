let app = angular.module('DocumentalRelationship', []);

app.controller('DocumentalRelationshipController', ['$window', '$http', function DocumentalRelationshipController($window, $http) {
    var ctx = this;

    // properties
    (() => {
        ctx.sharepointListNames = {
            policy: 'RelacionPolitica',
            norm: 'RelacionNormas',
            procedure: 'RelacionProcedimiento'
        };
        ctx.relationTypes = {
            policy: 'Politica',
            norm: 'Norma',
            procedure: 'Procedimiento'
        };
        ctx.relationCodes = {
            policy: 7,
            norm: 16,
            procedure: 15
        };
    })();

    // functions 
    (() => {
        ctx.getItems = (listName) => {
            let select = `Norma/Title,Norma/Id,Procedimiento/Title,Procedimiento/Id,Politica/Title,Politica/Id,${ctx.relationType}Fin/Title,${ctx.relationType}Fin/Id`;
            let filter = `${ctx.relationType}/Num eq ${ctx.relationCode}`;
            let expand = `Norma,Procedimiento,Politica,${ctx.relationType}Fin`;

            $http({
                url: `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/GetByTitle('${listName}')/items?$select=${select}&$expand=${expand}&$filter=${filter}`,
                method: "GET",
                headers: { "Accept": "application/json;odata=verbose" },
                contentType: "application/json; odata=verbose"
            }).then((response) => {
                console.log('response: ', response);
                ctx.processData(response.data.d.results, listName);
            }, (e) => {
                console.error(e);
            });
        }

        ctx.processData = (items, listName) => {
            ctx.politics = null;
            ctx.norms = null;
            ctx.procedures = null;
            ctx.asociated = null;

            for (let index = 0; index < items.length; index++) {
                const element = items[index];

                switch (listName) {
                    case ctx.sharepointListNames.policy:
                        if (!ctx.politics && element.Politica && element.Politica.Title)
                            ctx.politics = element.Politica;

                        if (!ctx.norms)
                            ctx.norms = [];

                        if (element.Norma && element.Norma.Title)
                            ctx.norms.push(element.Norma);

                        if (!ctx.procedures)
                            ctx.procedures = [];

                        if (element.Procedimiento && element.Procedimiento.Title)
                            ctx.procedures.push(element.Procedimiento);

                        if (!ctx.asociated)
                            ctx.asociated = [];

                        if (element[`${ctx.relationType}Fin`] && element[`${ctx.relationType}Fin`].Title)
                            ctx.asociated.push(element[`${ctx.relationType}Fin`]);

                        break;
                    case ctx.sharepointListNames.norm:
                        if (!ctx.norms && element.Norma && element.Norma.Title)
                            ctx.norms = element.Norma;

                        if (!ctx.politics)
                            ctx.politics = [];

                        if (element.Politica && element.Politica.Title)
                            ctx.politics.push(element.Politica);

                        if (!ctx.procedures)
                            ctx.procedures = [];

                        if (element.Procedimiento && element.Procedimiento.Title)
                            ctx.procedures.push(element.Procedimiento);

                        if (!ctx.asociated)
                            ctx.asociated = [];

                        if (element[`${ctx.relationType}Fin`] && element[`${ctx.relationType}Fin`].Title)
                            ctx.asociated.push(element[`${ctx.relationType}Fin`]);
                        break;
                    case ctx.sharepointListNames.procedure:
                        if (!ctx.procedures && element.Procedimiento && element.Procedimiento.Title)
                            ctx.procedures = element.Procedimiento;

                        if (!ctx.politics)
                            ctx.politics = [];

                        if (element.Politica && element.Politica.Title)
                            ctx.politics.push(element.Politica);

                        if (!ctx.norms)
                            ctx.norms = [];

                        if (element.Procedimiento && element.Procedimiento.Title)
                            ctx.norms.push(element.Procedimiento);

                        if (!ctx.asociated)
                            ctx.asociated = [];

                        if (element[`${ctx.relationType}Fin`] && element[`${ctx.relationType}Fin`].Title)
                            ctx.asociated.push(element[`${ctx.relationType}Fin`]);
                        break;
                }
            }

            ctx.getSearchedDocument();
        };

        ctx.getSearchedDocument = () => {
            ctx.searchedDocument = null;

            switch (ctx.relationType) {
                case ctx.relationTypes.policy:
                    ctx.searchedDocument = ctx.politics;
                    break;
                case ctx.relationTypes.norm:
                    ctx.searchedDocument = ctx.norms;
                    break;
                case ctx.relationTypes.procedure:
                    ctx.searchedDocument = ctx.procedures;
                    break;
            }
        };

        ctx.getRelationCode = () => {
            let relationCode = null;

            switch (ctx.relationType) {
                case ctx.relationTypes.policy:
                    relationCode = ctx.relationCodes.policy;
                    break;
                case ctx.relationTypes.norm:
                    relationCode = ctx.relationCodes.norm;
                    break;
                case ctx.relationTypes.procedure:
                    relationCode = ctx.relationCodes.procedure;
                    break;
            }

            return relationCode;
        };

        ctx.downloadFile = (id, code) => {
            $window.open(`${_spPageContextInfo.webAbsoluteUrl}/_layouts/DocIdRedir.aspx?ID=TUQPHRWUPM7P-${code}-${id}`, '_blank');
        };
    })();

    // onInit
    (() => {
        const params = new URLSearchParams(window.location.search);
        if (params.has('relationType')) {
            ctx.relationType = params.get('relationType');
        }

        if (params.has('relationCode')) {
            ctx.relationCode = params.get('relationCode');
        }

        if (ctx.relationType && ctx.relationCode) {
            switch (ctx.relationType) {
                case ctx.relationTypes.policy:
                    ctx.getItems(ctx.sharepointListNames.policy);
                    break;
                case ctx.relationTypes.norm:
                    ctx.getItems(ctx.sharepointListNames.norm);
                    break;
                case ctx.relationTypes.procedure:
                    ctx.getItems(ctx.sharepointListNames.procedure);
                    break;
            }
        }
    })();
}]);