SOURCE_PATH=$(cd $(dirname $0) && pwd)
# TODO [TEMPLATE] set dynamic value
echo "Running test for <%- roleName -> "
molecule test
