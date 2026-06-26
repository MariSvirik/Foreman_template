export type PythonPackageRow = {
  id: string;
  name: string;
  version: string;
  summary: string;
};

export const MOCK_PYTHON_PACKAGES: PythonPackageRow[] = [
  { id: '1', name: 'ansible-core', version: '2.14.4', summary: 'Radically simple IT automation.' },
  { id: '2', name: 'boto3', version: '1.26.100', summary: 'AWS SDK for Python.' },
  { id: '3', name: 'certifi', version: '2022.12.7', summary: 'Mozilla CA certificate bundle.' },
  { id: '4', name: 'cryptography', version: '40.0.1', summary: 'Cryptographic recipes and primitives.' },
  { id: '5', name: 'django', version: '4.2', summary: 'High-level Python web framework.' },
  { id: '6', name: 'flask', version: '2.3.2', summary: 'Lightweight WSGI web application framework.' },
  { id: '7', name: 'jinja2', version: '3.1.2', summary: 'Template engine for Python.' },
  { id: '8', name: 'numpy', version: '1.24.2', summary: 'Fundamental package for scientific computing.' },
  { id: '9', name: 'pip', version: '23.0.1', summary: 'Package installer for Python.' },
  { id: '10', name: 'psycopg2', version: '2.9.5', summary: 'PostgreSQL adapter for Python.' },
  { id: '11', name: 'pyyaml', version: '6.0', summary: 'YAML parser and emitter.' },
  { id: '12', name: 'requests', version: '2.28.2', summary: 'HTTP library for Python.' },
  { id: '13', name: 'setuptools', version: '67.6.0', summary: 'Build and distribute Python packages.' },
  { id: '14', name: 'sqlalchemy', version: '2.0.7', summary: 'SQL toolkit and ORM.' },
  { id: '15', name: 'urllib3', version: '1.26.15', summary: 'HTTP client for Python.' },
];
