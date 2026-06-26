export type AnsibleCollectionRow = {
  id: string;
  name: string;
  author: string;
  version: string;
  checksum: string;
  description: string;
  tags: string;
};

export function getAnsibleCollectionByName(name: string): AnsibleCollectionRow | undefined {
  return MOCK_ANSIBLE_COLLECTIONS.find((c) => c.name === name);
}

export const MOCK_ANSIBLE_COLLECTIONS: AnsibleCollectionRow[] = [
  { id: '1', name: 'foreman', author: 'theforeman', version: '0.7.0', checksum: 'b4f00c5bf01a670bc54ca3b4054e45fdc4c70f23beced5d4e9280728fe56d2d', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '2', name: 'foreman', author: 'theforeman', version: '1.0.1', checksum: 'bd658c58070a70bd442b60745f0438637d48c57030a6be48be37d323178e1cff', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '3', name: 'foreman', author: 'theforeman', version: '0.1.0', checksum: 'da7a1fcf7eba75ea94e94df6475da7298f44b6eba5baae7a6f3d613e979c889a', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '4', name: 'foreman', author: 'theforeman', version: '0.4.0', checksum: 'fd70605f49c5f46d7f051a9315cd3ba3bcf85f2be3ab0723566676e1e3a0e52', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '5', name: 'foreman', author: 'theforeman', version: '2.0.1', checksum: 'eb8148792706a898a42b24f03f40fd1bd78f4fbc88136c00e6f4c50bff47ffa', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '6', name: 'foreman', author: 'theforeman', version: '2.1.0', checksum: 'ac3245f89012b567d890e12f34a567b890cd12ef34567890abcdef1234567890', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '7', name: 'foreman', author: 'theforeman', version: '1.1.0', checksum: 'bd4356g90123c678e901f23g45b678c901de23fg45678901bcdefg2345678901', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '8', name: 'foreman', author: 'theforeman', version: '0.8.0', checksum: 'ce5467h01234d789f012g34h56c789d012ef34gh56789012cdefgh3456789012', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '9', name: 'foreman', author: 'theforeman', version: '0.5.0', checksum: 'df6578i12345e890g123h45i67d890e123fg45hi67890123defghi4567890123', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '10', name: 'foreman', author: 'theforeman', version: '0.3.0', checksum: 'eg7689j23456f901h234i56j78e901f234gh56ij78901234efghij5678901234', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '11', name: 'foreman', author: 'theforeman', version: '0.2.0', checksum: 'fh8790k34567g012i345j67k89f012g345hi67jk89012345fghijk6789012345', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '12', name: 'foreman', author: 'theforeman', version: '3.0.0', checksum: 'gi9801l45678h123j456k78l90g123h456ij78kl90123456ghijkl7890123456', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '13', name: 'foreman', author: 'theforeman', version: '2.2.0', checksum: 'hj0912m56789i234k567l89m01h234i567jk89lm01234567hijklm8901234567', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '14', name: 'foreman', author: 'theforeman', version: '1.2.0', checksum: 'ik1023n67890j345l678m90n12i345j678kl90mn12345678ijklmn9012345678', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '15', name: 'foreman', author: 'theforeman', version: '0.9.0', checksum: 'jl2134o78901k456m789n01o23j456k789lm01no23456789jklmno0123456789', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '16', name: 'foreman', author: 'theforeman', version: '0.6.0', checksum: 'km3245p89012l567n890o12p34k567l890mn12op34567890klmnop1234567890', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '17', name: 'foreman', author: 'theforeman', version: '3.1.0', checksum: 'ln4356q90123m678o901p23q45l678m901no23pq45678901lmnopq2345678901', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '18', name: 'foreman', author: 'theforeman', version: '2.3.0', checksum: 'mo5467r01234n789p012q34r56m789n012op34qr56789012mnopqr3456789012', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '19', name: 'foreman', author: 'theforeman', version: '1.3.0', checksum: 'np6578s12345o890q123r45s67n890o123pq45rs67890123nopqrs4567890123', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '20', name: 'foreman', author: 'theforeman', version: '3.2.0', checksum: 'oq7689t23456p901r234s56t78o901p234qr56st78901234opqrst5678901234', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '21', name: 'foreman', author: 'theforeman', version: '2.4.0', checksum: 'pr8790u34567q012s345t67u89p012q345rs67tu89012345pqrstu6789012345', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
  { id: '22', name: 'foreman', author: 'theforeman', version: '1.4.0', checksum: 'qs9801v45678r123t456u78v90q123r456st78uv90123456qrstuv7890123456', description: 'Ansible Modules to manage Foreman and Katello installations', tags: 'foreman,katello,satellite,orcharhino' },
];
