SOURCE_PATH=$(cd $(dirname $0) && pwd)
# TODO set dynamic value
echo "Running test for <%- roleName -> "
molecule test
