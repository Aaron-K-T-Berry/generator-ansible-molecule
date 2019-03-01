SOURCE_PATH=$(cd $(dirname $0) && pwd)
echo "Running test for <%- roleName %>"
molecule test
