import React from 'react';
import ReactTable, { ReactTableDefaults } from 'react-table';

class RTPaginationComponent extends ReactTableDefaults.PaginationComponent {
  render() {
    const { canNext, canPrevious, page, pages } = this.props;
    return (
      <div
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <div style={{ padding: '0 8px' }}>
          {page + 1} / {pages ? pages : '•'}
        </div>
        <div class="pt-button-group pt-minimal">
          <button
            type="button"
            className="pt-button pt-icon-chevron-left"
            onClick={() => {
              if (!canPrevious) return;
              this.changePage(page - 1);
            }}
            disabled={!canPrevious}
          />
          <button
            type="button"
            className="pt-button pt-icon-chevron-right"
            onClick={() => {
              if (!canNext) return;
              this.changePage(page + 1);
            }}
            disabled={!canNext}
          />
        </div>
      </div>
    );
  }
}

export default RTPaginationComponent;
