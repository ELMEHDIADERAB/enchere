import React from 'react';
function PublicRoute({ children }) {
    return children;
}
export default PublicRoute;

/*import React from 'react';

import ClientLayout from "../layouts/ClientLayout";

 function PublicRoute({ children, path, ...rest }) {
         return   <ClientLayout>{children}</ClientLayout>
 }
 export default PublicRoute;*/