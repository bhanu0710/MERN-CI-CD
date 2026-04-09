{{- define "mern-app.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "mern-app.namespace" -}}
{{- .Values.namespace.name -}}
{{- end -}}

