import React, { useCallback, useEffect, useState } from 'react';

type RestMethods = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
export interface FabricFieldConfig {
  key: string;
  label?: string;
  placeHolder?: string;
  type: 'text' | 'file' | 'date' | 'number';
  validator?: 'string' | ((value: any) => ValidatorResponse);
  isNullable?: boolean;
  isPostable?: boolean;
  isPutable?: boolean;
  isPatchable?: boolean;
  shouldShowInListView?: boolean;
}
export interface ValidatorResponse {
  status: boolean;
  message?: string;
}

export interface FabricEPConfig {
  url: string;
  methods: RestMethods[];
  fields: FabricFieldConfig[];
  key?: string;
  primaryFocusTarget?: string;
  validator: (FormData: Record<string, any>) => ValidatorResponse;
  shouldShowInMenu?: boolean;
  type?: 'card' | 'table';
  endpoints?: FabricEPConfig[];
}
export interface FabricProps {
  apiClient: (params: {
    method: string;
    query?: Record<string, any>;
    body?: Record<string, any>;
  }) => Record<string, any>;
  fabricEPConfig: FabricEPConfig[];
}

const FabricEPComponent = ({
  fabricEPConfig,
  data,
}: {
  fabricEPConfig: FabricEPConfig[];
  data: Record<string, any> | Record<string, any>[];
}): React.ReactNode => {
  return fabricEPConfig.map((endpoint) => {
    if (Array.isArray(data)) {
      return (
        <>
          {data.map((item, index) => (
            <div key={index}>
              {endpoint.fields.map((field, fieldIndex) => (
                <div key={`${index}-${fieldIndex}`}>
                  {field.label}:{item[field.key]}
                </div>
              ))}
            </div>
          ))}
        </>
      );
    } else {
      return (
        <>
          {endpoint.fields.map((field, fieldIndex) => (
            <div key={fieldIndex}>
              {field.label}:{data[0][field.key]}
            </div>
          ))}
        </>
      );
    }
  });
};

const Fabric = ({
  apiClient,
  fabricEPConfig,
}: FabricProps): React.ReactElement => {
  const [data, setData] = useState<Record<string, any> | Record<string, any>[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiClient({
        method: 'GET',
      });
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Some error';
      setError(new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message ?? 'some error occured'}</div>;
  }

  return (
    <div>
      <h1>Data</h1>
      <FabricEPComponent fabricEPConfig={fabricEPConfig} data={data} />
    </div>
  );
};
export default Fabric;
