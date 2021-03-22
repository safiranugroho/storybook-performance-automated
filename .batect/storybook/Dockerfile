FROM node:12-slim

# Install git, curl, bzip2, s3cmd and lz4
RUN apt-get -y update && apt-get -y -qq install git curl bzip2 s3cmd liblz4-tool && rm -rf /var/lib/apt/lists/*

# Install yarn
# NOTE: This version of yarn is not the one that is used to install dependencies at the root. That yarn
# version comes from bolt itself ("~/.config/yarn/global/node_modules/bolt/node_modules/.bin/yarn")
RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.22.0
ENV PATH $HOME/.yarn/bin:$PATH

# Install git-lfs
RUN build_deps="curl" && \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends ${build_deps} ca-certificates && \
    curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends git-lfs && \
    git lfs install && \
    apt-get clean && apt-get autoremove -y && rm -r /var/lib/apt/lists/*

# Install bolt - note: the globally installed bolt is really only used for the base `bolt install`.
# Everything else is done in yarn scripts using the locally installed bolt version (this version is
# much easier to update obviously).
ENV BOLT_VERSION "^0.24.4"
RUN yarn global add "bolt@$BOLT_VERSION"

ENTRYPOINT ["bolt"]
CMD ["storybook", "packages/design-system/menu"]

HEALTHCHECK --interval=3m \
  CMD curl -f http://localhost:56789/ || exit 1
